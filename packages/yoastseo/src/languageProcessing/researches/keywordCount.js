import { flatten } from "lodash-es";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { normalizeSingle } from "../helpers/sanitize/quotes";
import getMarkingsInSentence from "../helpers/highlighting/getMarkingsInSentence";
import matchKeyphraseWithSentence from "../helpers/match/matchKeyphraseWithSentence";
import isDoubleQuoted from "../helpers/match/isDoubleQuoted";
import matchTextWithTransliteration from "../helpers/match/matchTextWithTransliteration";

/**
 * Counts the number of matches for a keyphrase in a sentence.
 * @param {Token[]} matches The matches to count.
 * @param {(string[])[]} keyphraseForms The keyphrase forms that were used for matching.
 * @param {string} locale The locale used for transliteration.
 * @returns {number} The number of matches.
 */
const countMatches = ( matches, keyphraseForms, locale ) => {
	// the count is the number of complete matches.
	const matchesCopy = [ ...matches ];

	let nrMatches = 0;
	// While the number of matches is longer than or the same as the keyphrase forms.
	while ( matchesCopy.length >= keyphraseForms.length ) {
		let nrKeyphraseFormsWithMatch = 0;

		// for each keyphrase form, if there is a match that is equal to the keyphrase form, remove it from the matches.
		// If there is no match, return the current count.
		// If all keyphrase forms have a match, increase the count by 1.
		for ( let i = 0; i < keyphraseForms.length; i++ ) {
			const keyphraseForm = keyphraseForms[ i ];

			// check if any of the keyphrase forms is in the matches.
			const foundMatch = matchesCopy.find( match =>{
				return keyphraseForm.some( keyphraseFormWord => {
					// const theRegex = new RegExp( `^${keyphraseFormWord}$`, "ig" );
					// return match.text.match( theRegex );
					return matchTextWithTransliteration( match.text, keyphraseFormWord, locale );
				} );
			} );
			//
			if ( foundMatch ) {
				matchesCopy.splice( matchesCopy.indexOf( foundMatch ), 1 );
				nrKeyphraseFormsWithMatch += 1;
			}
		}
		if ( nrKeyphraseFormsWithMatch === keyphraseForms.length ) {
			nrMatches += 1;
		} else {
			return nrMatches;
		}
	}
	return nrMatches;
};

/**
 * Creates a new array in which consecutive matches are removed. A consecutive match occures if the same keyphrase occurs more than twice in a row.
 * The first and second match are kept, the rest is removed.
 * @param {Token[]} matches An array of all matches. (Including consecutive matches).
 * @returns {Token[]} An array of matches without consecutive matches.
 */
const removeConsecutiveMatches = ( matches ) => {
	// If there are three or more matches in a row, remove all but the first and the second.

	const matchesCopy = [ ...matches ];
	// const matchesCopy = cloneDeep( matches );
	let nrConsecutiveMatches = 0;
	let previousMatch = null;
	const result = [];

	for ( let i = 0; i < matchesCopy.length; i++ ) {
		const match = matchesCopy[ i ];

		if ( previousMatch && match.sourceCodeRange.startOffset === previousMatch.sourceCodeRange.endOffset + 1 &&
			match.text.toLowerCase() === previousMatch.text.toLowerCase() ) {
			nrConsecutiveMatches += 1;
		} else {
			nrConsecutiveMatches = 0;
		}

		if ( nrConsecutiveMatches < 2 ) {
			result.push( match );
		}

		previousMatch = match;
	}

	return result;
};

/**
 * Counts the occurrences of the keyphrase in the text and creates the Mark objects for the matches.
 *
 * @param {Sentence[]} sentences The sentences to check.
 * @param {Array} topicForms The keyphrase forms.
 * @param {string} locale The locale used in the analysis.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 * @param {boolean} isExactMatchRequested Whether the exact matching is requested.
 *
 * @returns {{markings: Mark[], count: number}} The number of keyphrase occurrences in the text and the Mark objects of the matches.
 */
export function countKeyphraseInText( sentences, topicForms, locale, matchWordCustomHelper, isExactMatchRequested ) {
	const result = { count: 0, markings: [] };

	sentences.forEach( sentence => {
		// eslint-disable-next-line no-warning-comments
		// TODO: test in Japanese to see if we use this helper as well
		const matchesInSentence = matchKeyphraseWithSentence( topicForms.keyphraseForms, sentence, locale, isExactMatchRequested );
		const matchesInSentenceWithoutConsecutiveMatches = removeConsecutiveMatches( matchesInSentence );
		const matchesCount = countMatches( matchesInSentenceWithoutConsecutiveMatches, topicForms.keyphraseForms, locale );
		const markings = getMarkingsInSentence( sentence, matchesInSentence, matchWordCustomHelper, locale );

		result.markings.push( markings );
		result.count += matchesCount;
	} );

	return result;
}

/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} An object containing an array of all the matches, markings and the keyphrase count.
 */
export default function keyphraseCount( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	topicForms.keyphraseForms = topicForms.keyphraseForms.map( word => word.map( form => normalizeSingle( form ) ) );
	// [ [tortie], [cat, cats] ]
	// KW: tortie cat
	// A pretty tortie cat, among many cats. Cats are beautiful. A pretty tortie cat, among many cats. Cats are beautiful.
	if ( topicForms.keyphraseForms.length === 0 ) {
		return {
			count: 0,
			markings: [],
			length: 0,
		};
	}

	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const locale = paper.getLocale();
	const sentences = getSentencesFromTree( paper );
	// Exact matching is requested when the keyphrase is enclosed in double quotes.
	const isExactMatchRequested = isDoubleQuoted( paper.getKeyword() );

	const keyphraseFound = countKeyphraseInText( sentences, topicForms, locale, matchWordCustomHelper, isExactMatchRequested );

	return {
		count: keyphraseFound.count,
		markings: flatten( keyphraseFound.markings ),
		length: topicForms.keyphraseForms.length,
	};
}

/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @deprecated Since version 20.8. Use keywordCountInSlug instead.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} An array of all the matches, markings and the keyphrase count.
 */
export function keywordCount( paper, researcher ) {
	console.warn( "This function is deprecated, use keyphraseCount instead." );
	return keyphraseCount( paper, researcher );
}

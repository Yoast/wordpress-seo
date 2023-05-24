import { flatten } from "lodash-es";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { normalizeSingle } from "../helpers/sanitize/quotes";
import getMarkingsInSentence from "../helpers/highlighting/getMarkingsInSentence";
import findKeyWordFormsInSentence  from "../helpers/match/findKeyWordFormsInSentence";
import matchKeywordWithSentence from "../helpers/match/matchKeywordWithSentence";

const countMatches = ( matches, keyphraseForms ) => {
	// the count is the number of complete matches.

	const matchesCopy = [ ...matches ];

	let nrMatches = 0;
	// While the number of matches is longer than the keyphrase forms.
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
					return match.text.toLowerCase() === keyphraseFormWord.toLowerCase();
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

			// const match = matches.find(match => match === keyphraseForm);
			// if (match) {
			// 	matches.splice(matches.indexOf(match), 1);
			// } else {
			// 	return matches.length;
			// }
		} else {
			return nrMatches;
		}
	}
	return nrMatches;
};

/**
 * Counts the occurrences of the keyphrase in the text and creates the Mark objects for the matches.
 *
 * @param {Array} sentences The sentences to check.
 * @param {Array} topicForms The keyphrase forms.
 * @param {string} locale The locale used in the analysis.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 *
 * @returns {{markings: Mark[], count: number}} The number of keyphrase occurrences in the text and the Mark objects of the matches.
 */
export function countKeyphraseInText( sentences, topicForms, locale, matchWordCustomHelper ) {
	const result = { count: 0, markings: [] };

	sentences.forEach( sentence => {
		// const matchesInSentence = findKeyWordFormsInSentence( sentence, topicForms.keyphraseForms, locale, matchWordCustomHelper );
		const matchesInSentence = matchKeywordWithSentence( topicForms.keyphraseForms, sentence );
		console.log( matchesInSentence);
		const matchesCount = countMatches( matchesInSentence, topicForms.keyphraseForms );
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
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const locale = paper.getLocale();
	const sentences = getSentencesFromTree( paper );

	const keyphraseFound = countKeyphraseInText( sentences, topicForms, locale, matchWordCustomHelper );
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

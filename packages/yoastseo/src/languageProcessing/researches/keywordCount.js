import { flatten, flattenDeep } from "lodash";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { normalizeSingle } from "../helpers/sanitize/quotes";
import getMarkingsInSentence from "../helpers/highlighting/getMarkingsInSentence";
import matchWordFormsWithSentence from "../helpers/match/matchWordFormsWithSentence";
import isDoubleQuoted from "../helpers/match/isDoubleQuoted";
import { markWordsInASentence } from "../helpers/word/markWordsInSentences";
import getSentences from "../helpers/sentence/getSentences";
import { filterShortcodesFromHTML } from "../helpers";

/**
 * Counts the occurrences of the keyphrase in the text and creates the Mark objects for the matches.
 *
 * @param {(Sentence|string)[]}	sentences			The sentences to check.
 * @param {Array}		keyphraseForms				The keyphrase forms.
 * @param {string}		locale						The locale used in the analysis.
 * @param {function}	matchWordCustomHelper		A custom helper to match words with a text.
 * @param {boolean}		isExactMatchRequested		Whether the exact matching is requested.
 * @param {function}	customSplitIntoTokensHelper	A custom helper to split sentences into tokens.
 *
 * @returns {{markings: Mark[], count: number}} The number of keyphrase occurrences in the text and the Mark objects of the matches.
 */
export function countKeyphraseInText( sentences, keyphraseForms, locale, matchWordCustomHelper,
	isExactMatchRequested, customSplitIntoTokensHelper ) {
	const result = { count: 0, markings: [] };

	sentences.forEach( sentence => {
		const matchesInSentence = keyphraseForms.map( wordForms => matchWordFormsWithSentence( sentence,
			wordForms, locale, matchWordCustomHelper, isExactMatchRequested, customSplitIntoTokensHelper ) );

		// A sentence has at least one full-match of the keyphrase if each word occurs at least once.
		const isEachWordFound = matchesInSentence.every( wordForms => wordForms.count > 0 );

		if ( isEachWordFound ) {
			/*
			 * Retrieve all the occurrences' count of each word of the keyphrase and save it in an array.
			 * matches: [ [ { matches: ["red"], count: 1 } ], [ { matches: ["pandas"], count: 2 } ] ]
			 * counts: [ 1, 2 ]
			 */
			const counts = matchesInSentence.map( match => match.count );
			/*
			 * The number of the full-match count is the lowest count of the occurrences.
			 * counts: [ 1, 2 ]
			 * totalMatchCount: 1
			 *
			 * From the example above, the full-match is 1, because one of the "pandas" occurrences is not accompanied by "red"
			 * to be counted as a full-match.
			 */
			const totalMatchCount = Math.min( ...counts );
			const foundWords = flattenDeep( matchesInSentence.map( match => match.matches ) );

			let markings = [];

			if ( matchWordCustomHelper ) {
				// Currently, this check is only applicable for Japanese.
				markings = markWordsInASentence( sentence, foundWords, matchWordCustomHelper );
			} else {
				markings = getMarkingsInSentence( sentence, foundWords );
			}

			result.count += totalMatchCount;
			result.markings.push( markings );
		}
	} );

	return result;
}

/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {{count: number, markings: Mark[], keyphraseLength: number}} An object containing the keyphrase count, markings and the kephrase length.
 */
export default function getKeyphraseCount( paper, researcher ) {
	const result = { count: 0, markings: [], keyphraseLength: 0 };
	const topicForms = researcher.getResearch( "morphology" );
	let keyphraseForms = topicForms.keyphraseForms;
	const keyphraseLength = keyphraseForms.length;

	/*
	 * Normalize single quotes so that word form with different type of single quotes can still be matched.
	 * For example, "key‛word" should match "key'word".
	 */
	keyphraseForms = keyphraseForms.map( word => word.map( form => normalizeSingle( form ) ) );

	if ( keyphraseLength === 0 ) {
		return result;
	}

	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const customSentenceTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const customSplitIntoTokensHelper = researcher.getHelper( "splitIntoTokensCustom" );
	const locale = paper.getLocale();
	const text = matchWordCustomHelper
		? filterShortcodesFromHTML( paper.getText(), paper._attributes && paper._attributes.shortcodes )
		: paper.getText();

	// When the custom helper is available, we're using the sentences retrieved from the text for the analysis.
	const sentences = matchWordCustomHelper ? getSentences( text, customSentenceTokenizer ) : getSentencesFromTree( paper );
	// Exact matching is requested when the keyphrase is enclosed in double quotes.
	const isExactMatchRequested = isDoubleQuoted( paper.getKeyword() );

	/*
	* Count the amount of keyphrase occurrences in the sentences.
	* An occurrence is counted when all words of the keyphrase are contained within the sentence. Each sentence can contain multiple keyphrases.
	* (e.g. "The apple potato is an apple and a potato." has two occurrences of the keyphrase "apple potato").
	*/
	const keyphraseFound = countKeyphraseInText( sentences, keyphraseForms, locale, matchWordCustomHelper,
		isExactMatchRequested, customSplitIntoTokensHelper );

	result.count = keyphraseFound.count;
	result.markings = flatten( keyphraseFound.markings );
	result.keyphraseLength = keyphraseLength;

	return result;
}

/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @deprecated Use getKeyphraseCount instead.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} An array of all the matches, markings and the keyphrase count.
 */
export function keywordCount( paper, researcher ) {
	console.warn( "This function is deprecated, use getKeyphraseCount instead." );
	return getKeyphraseCount( paper, researcher );
}

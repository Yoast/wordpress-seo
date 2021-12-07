import matchTextWithArray from "./matchTextWithArray.js";
import { sum } from "lodash-es";
import { isEmpty } from "lodash-es";

/**
 * Matches forms of words in the keyphrase against a given text.
 *
 * @param {Array} keywordForms The array with word forms of all (content) words from the keyphrase in a shape
 *                             [ [ form1, form2, ... ], [ form1, form2, ... ] ]
 * @param {string} text The string to match the word forms against.
 * @param {string} locale The locale of the paper.
 * @param {function}    matchWordCustomHelper The helper function to match word in text.
 *
 * @returns {Object} The number and the percentage of the keyphrase words that were matched in the text by at least one form.
 */
const findWordFormsInString = function( keywordForms, text, locale, matchWordCustomHelper ) {
	const wordNumber = keywordForms.length;
	const foundWords = Array( wordNumber );

	for ( let i = 0; i < wordNumber; i++ ) {
		const found = matchTextWithArray( text, keywordForms[ i ], locale, matchWordCustomHelper ).count > 0;
		foundWords[ i ] = found ? 1 : 0;
	}
	const foundNumberOfWords = sum( foundWords );
	const result = {
		countWordMatches: foundNumberOfWords,
		percentWordMatches: 0,
	};

	if ( wordNumber > 0 ) {
		result.percentWordMatches = Math.round( foundNumberOfWords / wordNumber * 100 );
	}

	return result;
};

/**
 * Matches forms of words in the keyphrase and in the synonyms against a given text.
 *
 * @param {Object}      topicForms       The object with word forms of all (content) words from the keyphrase and eventually synonyms,
 * comes in a shape {
 *                     keyphraseForms: [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                     synonymsForms: [
 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                          [[ form1, form2, ... ], [ form1, form2, ... ]],
 *                     ],
 *                  }
 * @param {string}      text                    The string to match the word forms against.
 * @param {boolean}     useSynonyms             Whether to use synonyms as if it was keyphrase or not (depends on the assessment).
 * @param {string}      locale                  The locale of the paper.
 * @param {function}    matchWordCustomHelper   The language-specific helper function to match word in text.
 *
 * @returns {Object} The number and the percentage for the keyphrase words or synonyms that were matched in the text by at least one form,
 * and whether the keyphrase or a synonym was matched.
 */
const findTopicFormsInString = function( topicForms, text, useSynonyms, locale, matchWordCustomHelper ) {
	// First check if the keyword is found in the text
	let result = findWordFormsInString( topicForms.keyphraseForms, text, locale, matchWordCustomHelper );
	result.keyphraseOrSynonym = "keyphrase";

	// If a full match found with the keyword or if no synonyms are supplied or supposed to be used, return the keyphrase search result.
	if ( result.percentWordMatches === 100 || useSynonyms === false || isEmpty( topicForms.synonymsForms ) ) {
		return result;
	}

	// Collect results of matching of every synonym with the text.
	const resultsSynonyms = [];
	for ( let i = 0; i < topicForms.synonymsForms.length; i++ ) {
		const synonym = topicForms.synonymsForms[ i ];
		resultsSynonyms[ i ] = findWordFormsInString( synonym, text, locale, matchWordCustomHelper );
	}

	// Find which synonym occurred most fully.
	const foundSynonyms = resultsSynonyms.map( resultSynonyms => resultSynonyms.percentWordMatches );
	const bestSynonymIndex = foundSynonyms.indexOf( Math.max( ...foundSynonyms ) );

	// If the best synonym showed lower results than the keyword, return the keyword.
	if ( result.percentWordMatches >= resultsSynonyms[ bestSynonymIndex ].percentWordMatches ) {
		return result;
	}

	// If the best synonym showed better results than the keyword, return the synonym.
	result = resultsSynonyms[ bestSynonymIndex ];
	result.keyphraseOrSynonym = "synonym";

	return result;
};

export {
	findWordFormsInString,
	findTopicFormsInString,
};

/** @module analyses/findKeywordInPageTitle */

import wordMatch from "../stringProcessing/matchTextWithWord.js";
const findTopicFormsInString = require( "./findKeywordFormsInString.js" ).findTopicFormsInString;

import getFunctionWordsFactory from "../helpers/getFunctionWords";

import { escapeRegExp, get, includes, isUndefined } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import addWordboundary from "../stringProcessing/addWordboundary";

const getFunctionWords = getFunctionWordsFactory();

/**
 * Strips all function words from the start of the given string.
 * @param {string[]} functionWords The array of function words to strip from the start.
 * @param {string} str The string from which to strip the function words.
 * @returns {string} The given string with the function words stripped.
 */
const stripFunctionWordsFromStart = function( functionWords, str ) {
	let strippedTitle = str.toLocaleLowerCase();
	// Try to strip each function word from the start of the str.
	functionWords.forEach( word => {
		const regex = new RegExp( "^" + addWordboundary( word.toLocaleLowerCase() ) );
		strippedTitle = strippedTitle.replace( regex, "" );
	} );

	// Nothing has been stripped, no function words found at the start.
	if ( strippedTitle.length === str.length ) {
		return strippedTitle;
	}
	// Recursively call function until all function words have been stripped from the start.
	return stripFunctionWordsFromStart( functionWords, strippedTitle );
};

/**
 * Counts the occurrences of the keyword in the page title. Returns the result that contains information on
 * (1) whether the exact match of the keyphrase was used in the title,
 * (2) whether all (content) words from the keyphrase were found in the title,
 * (3) at which position the exact match was found in the title.
 *
 * @param {Object} paper The paper containing title and keyword.
 * @param {Researcher} researcher The researcher to use for analysis.
 *
 * @returns {Object} result with the information on whether the keyphrase was matched in the title and how.
 */
export default function( paper, researcher ) {
	let keyword = escapeRegExp( paper.getKeyword() );
	const title = paper.getTitle();
	const locale = paper.getLocale();

	const result = { exactMatch: false, allWordsFound: false, position: -1, exactMatchKeyphrase: false  };

	// First check if morphology is suppressed. If so, strip the quotation marks from the keyphrase.
	const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( includes( doubleQuotes, keyword[ 0 ] ) && includes( doubleQuotes, keyword[ keyword.length - 1 ] ) ) {
		keyword = keyword.substring( 1, keyword.length - 1 );
		result.exactMatchKeyphrase = true;
	}

	// Check 1: Is the exact match of the keyphrase found in the title?
	const keywordMatched = wordMatch( title, keyword, locale );

	if ( keywordMatched.count > 0 ) {
		result.exactMatch = true;
		result.allWordsFound = true;
		result.position = keywordMatched.position;
		const language = getLanguage( locale );

		// If function words exist for this language...
		const functionWords = get( getFunctionWords, [ language ], [] );
		if ( ! isUndefined( functionWords.all ) ) {
			// Strip all function words from the beginning of the title.
			const strippedTitle = stripFunctionWordsFromStart( functionWords.all, title );
			// Match the keyphrase with the stripped title.
			const strippedTitleMatch = wordMatch( strippedTitle, keyword, locale );
			// Update the position (such that beginning is still 0).
			result.position = strippedTitleMatch.position;
		}

		return result;
	}

	// Check 2: Are all content words from the keyphrase in the title?
	const topicForms = researcher.getResearch( "morphology" );

	// Use only keyphrase ( not the synonyms) to match topic words in the title.
	const useSynonyms = false;

	const separateWordsMatched = findTopicFormsInString( topicForms, title, useSynonyms, locale );

	if ( separateWordsMatched.percentWordMatches === 100 ) {
		result.allWordsFound = true;
	}

	return result;
}

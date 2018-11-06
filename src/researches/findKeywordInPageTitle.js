/** @module analyses/findKeywordInPageTitle */

import wordMatch from "../stringProcessing/matchTextWithWord.js";
import { findTopicFormsInString } from "./findKeywordFormsInString.js";

import getFunctionWordsFactory from "../helpers/getFunctionWords";

import { escapeRegExp, get, includes, isUndefined } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import addWordboundary from "../stringProcessing/addWordboundary";
import getWords from "../stringProcessing/getWords";

const getFunctionWords = getFunctionWordsFactory();

/**
 * Strips all function words from the start of the given string.
 * @param {string[]} functionWords The array of function words to strip from the start.
 * @param {string} str The string from which to strip the function words.
 * @returns {string} The given string with the function words stripped.
 */
const stripFunctionWordsFromStart = function( functionWords, str ) {
	str = str.toLocaleLowerCase();
	let strippedTitle = str.toLocaleLowerCase();
	const titleWords = getWords( str );

	// Strip all function words from the start of the title string.
	for ( let i = 0; i < titleWords.length; i++ ) {
		const word = titleWords[ i ];
		// If this word is a function word, strip it from the title.
		// Else, break since there are no words to strip from the beginning.
		if ( functionWords.includes( word ) ) {
			const regex = new RegExp( "^(" + addWordboundary( word ) + ")" );
			strippedTitle = strippedTitle.replace( regex, "" );
		} else {
			break;
		}
	}

	return strippedTitle;
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

		if ( process.env.YOAST_RECALIBRATION === "enabled" ) {
			// If function words exist for this language...
			const functionWords = get( getFunctionWords, [ language ], [] );
			if ( ! isUndefined( functionWords.all ) ) {
				// Strip all function words from the beginning of the title.
				const strippedTitle = stripFunctionWordsFromStart( functionWords.all, title );
				// Match the keyphrase with the stripped title.
				const strippedTitleMatch = wordMatch( strippedTitle, keyword, locale );
				// Update the position (such that "the keyword" is still counted as position 0).
				result.position = strippedTitleMatch.position;
			}
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

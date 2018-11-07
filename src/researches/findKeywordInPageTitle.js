/** @module analyses/findKeywordInPageTitle */

import wordMatch from "../stringProcessing/matchTextWithWord.js";
import { findTopicFormsInString } from "./findKeywordFormsInString.js";

import getFunctionWordsFactory from "../helpers/getFunctionWords";

import { escapeRegExp, filter, get, includes, isEmpty, isUndefined } from "lodash-es";
import getLanguage from "../helpers/getLanguage";
import getWords from "../stringProcessing/getWords";

const getFunctionWords = getFunctionWordsFactory();

/**
 * Strips all function words from the start of the given string.
 *
 * @param {string[]} functionWords The array of function words to strip from the start.
 * @param {string} str The string from which to strip the function words.
 *
 * @returns {boolean} Whether the string consists of function words only.
 */
const stripFunctionWordsFromStart = function( functionWords, str ) {
	str = str.toLocaleLowerCase();
	let titleWords = getWords( str.toLocaleLowerCase() );

	// Strip all function words from the start of the string.
	titleWords = filter( titleWords, function( word ) {
		return ( ! includes( functionWords, word.trim().toLocaleLowerCase() ) );
	} );

	return isEmpty( titleWords );
};

/**
 * Checks if exact match functionality is requested by enclosing the keyphrase in double quotation marks.
 *
 * @param {string} keyword The keyword to check.
 *
 * @returns {Object} Whether the exact match funcionality is requested and the keyword stripped from double quotes.
 */
const processExactMatchRequest = function( keyword ) {
	const exactMatchRequest = { exactMatchRequested: false, keyword: keyword };

	// Check if morphology is suppressed. If so, strip the quotation marks from the keyphrase.
	const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( includes( doubleQuotes, keyword[ 0 ] ) && includes( doubleQuotes, keyword[ keyword.length - 1 ] ) ) {
		exactMatchRequest.keyword = keyword.substring( 1, keyword.length - 1 );
		exactMatchRequest.exactMatchRequested = true;
	}

	return exactMatchRequest;
};

/**
 * Checks whether an exact match of the keyphrase is found in the title.
 *
 * @param {string} title The title of the paper.
 * @param {number} position The position of the keyphrase in the title.
 * @param {string} locale The locale of the paper.
 *
 * @returns {number} Potentially adjusted position of the keyphrase in the title.
 */
const adjustPosition = function( title, position, locale ) {
	// Don't do anything if position if already 0.
	if ( position === 0 ) {
		return position;
	}

	// Don't do anything for non-recalibration.
	if ( ! ( process.env.YOAST_RECALIBRATION === "enabled" ) ) {
		return position;
	}

	// Don't do anything if no function words exist for this locale.
	const language = getLanguage( locale );
	const functionWords = get( getFunctionWords, [ language ], [] );
	if ( isUndefined( functionWords.all ) ) {
		return position;
	}

	// Strip all function words from the beginning of the title.
	const titleBeforeKeyword = title.substr( 0, position );
	if ( stripFunctionWordsFromStart( functionWords.all, titleBeforeKeyword ) ) {
		/*
		 * Return position 0 if there are no words left in the title before the keyword after filtering
		 * the function words (such that "keyword" in "the keyword" is still counted as position 0).
 		 */
		return 0;
	}

	return position;
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

	const result = { exactMatchFound: false, allWordsFound: false, position: -1, exactMatchKeyphrase: false  };

	// Check if the keyphrase is enclosed in double quotation marks to ensure that only exact matches are processed.
	const exactMatchRequest = processExactMatchRequest( keyword );
	if ( exactMatchRequest.exactMatchRequested ) {
		keyword = exactMatchRequest.keyword;
		result.exactMatchKeyphrase = true;
	}

	// Check if the exact match of the keyphrase found in the title.
	const keywordMatched = wordMatch( title, keyword, locale );

	if ( keywordMatched.count > 0 ) {
		result.exactMatchFound = true;
		result.allWordsFound = true;
		result.position = adjustPosition( title, keywordMatched.position, locale );

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

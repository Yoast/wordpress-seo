/** @module analyses/findKeywordInPageTitle */
import wordMatch from "../helpers/match/matchTextWithWord.js";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString.js";

import { escapeRegExp, filter, includes, isEmpty } from "lodash-es";
import processExactMatchRequest from "../helpers/match/processExactMatchRequest";
import getWords from "../helpers/word/getWords";

let functionWords = [];

/**
 * Strips all function words from the start of the given string.
 *
 * @param {string} str The string from which to strip the function words.
 *
 * @returns {boolean} Whether the string consists of function words only.
 */
const stripFunctionWordsFromStart = function( str ) {
	str = str.toLocaleLowerCase();
	let titleWords = getWords( str.toLocaleLowerCase() );

	// Strip all function words from the start of the string.
	titleWords = filter( titleWords, function( word ) {
		return ( ! includes( functionWords, word.trim().toLocaleLowerCase() ) );
	} );

	return isEmpty( titleWords );
};

/**
 * Checks the position of the keyphrase in the title.
 *
 * @param {string} title The title of the paper.
 * @param {number} position The position of the keyphrase in the title.
 *
 * @returns {number} Potentially adjusted position of the keyphrase in the title.
 */
const adjustPosition = function( title, position ) {
	// Don't do anything if position if already 0.
	if ( position === 0 ) {
		return position;
	}

	// Don't do anything if no function words exist for this language.
	if ( functionWords.length === 0 ) {
		return position;
	}

	// Strip all function words from the beginning of the title.
	const titleBeforeKeyword = title.substr( 0, position );
	if ( stripFunctionWordsFromStart( titleBeforeKeyword ) ) {
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
 * @param {Object} paper 			The paper containing title and keyword.
 * @param {Researcher} researcher 	The researcher to use for analysis.
 *
 * @returns {Object} result with the information on whether the keyphrase was matched in the title and how.
 */
const findKeyphraseInPageTitle = function( paper, researcher ) {
	functionWords = researcher.getConfig( "functionWords" );

	let keyword = escapeRegExp( paper.getKeyword() );
	let title = paper.getTitle();
	const locale = paper.getLocale();

	const result = { exactMatchFound: false, allWordsFound: false, position: -1, exactMatchKeyphrase: false  };

	// Check if the keyphrase is enclosed in double quotation marks to ensure that only exact matches are processed.
	const exactMatchRequest = processExactMatchRequest( keyword );

	if ( exactMatchRequest.exactMatchRequested ) {
		keyword = exactMatchRequest.keyphrase;
		result.exactMatchKeyphrase = true;
	}

	// Check if the exact match of the keyphrase is found in the title.
	const keywordMatched = wordMatch( title, keyword, locale, false );

	if ( keywordMatched.count > 0 ) {
		result.exactMatchFound = true;
		result.allWordsFound = true;
		result.position = adjustPosition( title, keywordMatched.position );

		return result;
	}

	// Check 2: Are all content words from the keyphrase in the title?
	const topicForms = researcher.getResearch( "morphology" );

	// Use only keyphrase (not the synonyms) to match topic words in the title.
	const useSynonyms = false;

	const separateWordsMatched = findTopicFormsInString( topicForms, title, useSynonyms, locale, false );

	if ( separateWordsMatched.percentWordMatches === 100 ) {
		result.allWordsFound = true;
	}

	return result;
};

export default findKeyphraseInPageTitle;

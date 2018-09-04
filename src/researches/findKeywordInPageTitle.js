/** @module analyses/findKeywordInPageTitle */

const wordMatch = require( "../stringProcessing/matchTextWithWord.js" );
const findTopicFormsInString = require( "./findKeywordFormsInString.js" ).findTopicFormsInString;

import { escapeRegExp } from "lodash-es";

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

module.exports = function( paper, researcher ) {
	const keyword = escapeRegExp( paper.getKeyword() );
	const title = paper.getTitle();
	const locale = paper.getLocale();

	const result = { exactMatch: false, allWordsFound: false, position: -1 };

	// Check 1: Is the exact match of the keyphrase found in the title?
	const keywordMatched = wordMatch( title, keyword, locale );

	if ( keywordMatched.count > 0 ) {
		result.exactMatch = true;
		result.allWordsFound = true;
		result.position = keywordMatched.position;

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
};

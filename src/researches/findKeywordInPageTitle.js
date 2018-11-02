/** @module analyses/findKeywordInPageTitle */

import wordMatch from "../stringProcessing/matchTextWithWord.js";
const findTopicFormsInString = require( "./findKeywordFormsInString.js" ).findTopicFormsInString;

import getFunctionWordsFactory from "../helpers/getFunctionWords";

import { escapeRegExp, get, includes, isUndefined } from "lodash-es";
import createRegexFromArray from "../stringProcessing/createRegexFromArray";
import stripSpaces from "../stringProcessing/stripSpaces";
import getLanguage from "../helpers/getLanguage";

const getFunctionWords = getFunctionWordsFactory();

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

		// Strip function words from the beginning of the title.
		const functionWords = get( getFunctionWords, [ language ], [] );
		if ( ! isUndefined( functionWords ) ) {
			const functionWordsRegex = createRegexFromArray( functionWords.all, false, "start" );
			const strippedTitle = escapeRegExp( stripSpaces( title.replace( functionWordsRegex, "" ) ) );

			// If nothing has been stripped, return the old result, otherwise return the new one.
			if ( strippedTitle.length !== title.length ) {
				result.position = strippedTitle.toLocaleLowerCase().indexOf( keyword.toLocaleLowerCase() );
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

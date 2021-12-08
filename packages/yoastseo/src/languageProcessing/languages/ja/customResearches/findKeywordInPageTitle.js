import { isEmpty } from "lodash-es";
import { findWordFormsInString } from "../../../helpers/match/findKeywordFormsInString";
import wordMatch from "../../../helpers/match/matchTextWithWord";
import processExactMatchRequest from "../../../helpers/match/processExactMatchRequest";
import japaneseWordMatchHelper from "../helpers/matchTextWithWord";
import functionWords from "../config/functionWords";
import getWords from "../helpers/getWords";

/**
 * Checks the position of the keyphrase in the title.
 *
 * @param {string} title    The title of the paper.
 * @param {number} position The position of the keyphrase in the title.
 *
 * @returns {number} Potentially adjusted position of the keyphrase in the title.
 */
function adjustPosition( title, position ) {
	// Don't do anything if position if already 0.
	if ( position === 0 ) {
		return position;
	}

	// Retrieve the title words before the keyphrase.
	let titleBeforeKeyword = title.substr( 0, position );
	titleBeforeKeyword = getWords( titleBeforeKeyword );
	// Retrieve the non-function words.
	titleBeforeKeyword = titleBeforeKeyword.filter( word => ! functionWords.includes( word ) );

	if ( isEmpty( titleBeforeKeyword ) ) {
		/*
		 * Return position 0 if there are no words left in the title before the keyword after filtering
		 * the function words (such that "楽しい旅行" in "その楽しい旅行" is still counted as position 0).
 		 */
		return 0;
	}

	return position;
}

/**
 * Checks the occurrences of the keyphrase in the page title. Returns a result that contains information on
 * (1) whether an exact-match is found
 * (2) whether all the keyphrase forms are found,
 * (3) the lowest number of the positions of the matches, and
 * (4) whether the exact match keyphrase is requested.
 *
 * @param {Object} paper 			The paper containing title and keyword.
 * @param {Researcher} researcher 	The researcher to use for analysis.
 *
 * @returns {Object} An object containing these info: (1) whether an exact-match is found, (2) whether all the keyphrase forms are found,
 * (3) the lowest number of the positions of the matches, and (4) whether the exact match keyphrase is requested.
 */
export default function( paper, researcher ) {
	const title = paper.getTitle();
	let keyphrase = paper.getKeyword();
	const result = { exactMatchFound: false, allWordsFound: false, position: -1, exactMatchKeyphrase: false  };

	// Check if the keyword is enclosed in quotation mark.
	// If yes, remove the quotation marks and check if the exact match of the keyphrase is found in the title.
	const doubleQuotes = [ "“", "”", "〝", "〞", "〟", "‟", "„", "\"", "\u300c", "\u300d", "\u300e", "\u300f" ];
	const exactMatchRequest = processExactMatchRequest( keyphrase, doubleQuotes );
	if ( exactMatchRequest.exactMatchRequested ) {
		result.exactMatchKeyphrase = true;
		keyphrase = exactMatchRequest.keyphrase;

		// Check if the exact match of the keyphrase is found in the title.
		const keyphraseMatched = wordMatch( title, keyphrase, "ja", japaneseWordMatchHelper );

		if ( keyphraseMatched.count > 0 ) {
			result.exactMatchFound = true;
			result.allWordsFound = true;
			result.position = adjustPosition( title, keyphraseMatched.position );
		}
		return result;
	}

	// Get the forms of the keyword (using the morphology research).
	const keyphraseForms = researcher.getResearch( "morphology" );

	const separateWordFormsMatched = findWordFormsInString( keyphraseForms, title, "ja", japaneseWordMatchHelper );
	if ( separateWordFormsMatched.percentWordMatches === 100 ) {
		result.allWordsFound = true;
		result.position = adjustPosition( title, separateWordFormsMatched.position );
	}

	return result;
}

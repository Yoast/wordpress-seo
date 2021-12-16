/** @module stringProcessing/findKeywordInUrl */

import { findTopicFormsInString } from "./findKeywordFormsInString.js";

/**
 * Matches the keyword in the anchor text.
 *
 * @param {string}      url         The url to check for keyword.
 * @param {Object}      topicForms  The keyphrase and synonyms forms to look for.
 * @param {string}      locale      The locale used for transliteration.
 * @param {function}    matchWordCustomHelper   The helper function to match word in text.
 * @param {object}      isExactMatchRequested   An object containing the keyphrase and information whether the exact match has been requested.
 *
 * @returns {boolean} Returns true if the keyphrase is found, otherwise returns false.
 */
export default function( url, topicForms, locale = "en_EN", matchWordCustomHelper, isExactMatchRequested ) {
	let formatUrl = url.match( />(.*)/ig );
	if ( formatUrl !== null ) {
		formatUrl = formatUrl[ 0 ].replace( /<.*?>\s?/ig, "" );
		formatUrl = formatUrl.slice( 1 ).toString();

		// Return true when the exact match is requested and the anchor text contains the keyphrase.
		if ( isExactMatchRequested.exactMatchRequested && formatUrl.includes( isExactMatchRequested.keyphrase ) ) {
			return true;
		}

		const topicInLinkText = findTopicFormsInString( topicForms, formatUrl, true, locale, matchWordCustomHelper  );

		return topicInLinkText.percentWordMatches === 100;
	}

	return false;
}

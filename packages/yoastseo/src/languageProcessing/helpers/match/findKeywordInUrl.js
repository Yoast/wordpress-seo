/** @module stringProcessing/findKeywordInUrl */

import { findTopicFormsInString } from "./findKeywordFormsInString.js";

/**
 * Matches the keyword in the anchor text.
 *
 * @param {string}      url         The url to check for keyword.
 * @param {Object}      topicForms  The keyphrase and synonyms forms to look for.
 * @param {string}      locale      The locale used for transliteration.
 * @param {function}    matchWordCustomHelper   The helper function to match word in text.
 *
 * @returns {boolean} Returns true if the keyphrase is found, otherwise returns false.
 */
export default function( url, topicForms, locale = "en_EN", matchWordCustomHelper ) {
	let formatUrl = url.match( />(.*)/ig );
	if ( formatUrl !== null ) {
		formatUrl = formatUrl[ 0 ].replace( /<.*?>\s?/ig, "" );
		formatUrl = formatUrl.slice( 1 ).toString();

		const topicInLinkText = findTopicFormsInString( topicForms, formatUrl, true, locale, matchWordCustomHelper  );

		return topicInLinkText.percentWordMatches === 100;
	}

	return false;
}

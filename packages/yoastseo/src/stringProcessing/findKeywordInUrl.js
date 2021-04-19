/** @module stringProcessing/findKeywordInUrl */

import { findTopicFormsInString } from "../researches/findKeywordFormsInString.js";

/**
 * Matches the keyword in the URL.
 *
 * @param {string} url The url to check for keyword
 * @param {Object} topicForms The keyphrase and synonyms forms to look for
 * @param {string} locale The locale used for transliteration.
 * @returns {boolean} If a keyword is found, returns true
 */
export default function( url, topicForms, locale = "en_EN" ) {
	var formatUrl = url.match( />(.*)/ig );
	if ( formatUrl !== null ) {
		formatUrl = formatUrl[ 0 ].replace( /<.*?>\s?/ig, "" );
		formatUrl = formatUrl.slice( 1 ).toString();

		const topicInLinkText = findTopicFormsInString( topicForms, formatUrl, true, locale );

		return topicInLinkText.percentWordMatches === 100;
	}

	return false;
}

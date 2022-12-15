/** @module stringProcessing/addWordboundary */
/* eslint-disable no-useless-escape */

import { wordBoundariesStringForRegex, singleQuotesForRegex } from "../../../config/punctuation";
console.log(wordBoundariesStringForRegex)

/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {string}  matchString                 The string to generate a regex string for.
 * @param {boolean} [positiveLookAhead=false]   Boolean indicating whether or not to include a positive look ahead
 * for the word boundaries at the end.
 * @param {string} [extraWordBoundary=""]       Extra characters to match a word boundary on.
 * @param {string} [locale=""]                  The locale used to determine the word boundary.
 *
 * @returns {string} A regex string that matches the matchString with word boundaries.
 */
export default function( matchString, positiveLookAhead = false, extraWordBoundary="", locale = "" ) {
	let wordBoundary, wordBoundaryEnd;

	// if ( locale === "id_ID" ) {
	// 	wordBoundary = "[ \\u00a0\\n\\r\\t\.,\(\)”“〝〞〟‟„\"\+;!¡\?¿:\/»«‹›" + "<>";
	// } else {
	/*
		* \u00a0 - no-break space
		* \u2014 - em dash
		* \u06d4 - Urdu full stop
		* \u061f - Arabic question mark
		* \u060C - Arabic comma
		* \u061B - Arabic semicolon
		*/
	wordBoundary = `[${wordBoundariesStringForRegex}`;
	// }

	const wordBoundaryStart = `(^|${wordBoundary}${singleQuotesForRegex}])`;
	if ( positiveLookAhead ) {
		wordBoundaryEnd = `($|((?=${wordBoundary}]))|(([${singleQuotesForRegex}])(${wordBoundary}])))`;
	} else {
		wordBoundaryEnd = `($|(${wordBoundary}])|(([${singleQuotesForRegex}])(${wordBoundary}])))`;
	}

	return wordBoundaryStart + matchString + wordBoundaryEnd;
}

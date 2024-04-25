/** @module stringProcessing/createRegexFromArray */

import { map } from "lodash";
import addWordBoundary from "../word/addWordboundary.js";
import replaceDiacritics from "../transliterate/replaceDiacritics";
import sanitizeString from "../sanitize/sanitizeString";

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {string[]} array                      The array with strings
 * @param {boolean} [disableWordBoundary=false] Boolean indicating whether or not to disable word boundaries.
 * @param {string} [extraBoundary=""]           A string that is used as extra boundary for the regex.
 * @param {boolean} [doReplaceDiacritics=false] If set to true, it replaces diacritics. Defaults to false.
 *
 * @returns {RegExp} regex                              The regex created from the array.
 */
export default function( array, disableWordBoundary = false, extraBoundary = "", doReplaceDiacritics = false ) {
	array = map( array, function( string ) {
		if ( doReplaceDiacritics ) {
			string = replaceDiacritics( string );
		}

		string = sanitizeString( string );

		if ( disableWordBoundary ) {
			return string;
		}
		return addWordBoundary( string, true, extraBoundary );
	} );

	const regexString = "(" + array.join( ")|(" ) + ")";

	return new RegExp( regexString, "ig" );
}

/** @module stringProcessing/createRegexFromArray */

import { map } from "lodash-es";
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
 * @param {boolean} [ignoreWhenInHtmlTag=false] The regex does not recognize a word when it is inside a html tag.
 *
 * @returns {RegExp} regex                              The regex created from the array.
 */
export default function( array, disableWordBoundary = false, extraBoundary = "", doReplaceDiacritics = false, ignoreWhenInHtmlTag = true ) {
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

	let regexString = "(" + array.join( ")|(" ) + ")";

	if ( ignoreWhenInHtmlTag ) {
		regexString += "(?![^<>]*>)";
	}

	return new RegExp( regexString, "ig" );
}

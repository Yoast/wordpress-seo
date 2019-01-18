/** @module stringProcessing/createRegexFromArray */

import { map, memoize } from "lodash-es";
import addWordBoundary from "./addWordboundary.js";
import replaceDiacritics from "./replaceDiacritics";
import sanitizeString from "./sanitizeString";

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} [disableWordBoundary=false] Boolean indicating whether or not to disable word boundaries.
 * @param {string} [extraBoundary=""] A string that is used as extra boundary for the regex.
 * @param {boolean} [doReplaceDiacritics=false] If set to true, it replaces diacritics. Defaults to false.
 *
 * @returns {RegExp} regex The regex created from the array.
 */
export default memoize( function( array, disableWordBoundary = false, extraBoundary = "", doReplaceDiacritics = false ) {
	const cleanedArray = map( array, function( string ) {
		if ( doReplaceDiacritics ) {
			string = replaceDiacritics( string );
		}

		string = sanitizeString( string );

		return string;
	} );

	const boundedArray = map( cleanedArray, function( string ) {
		if ( disableWordBoundary ) {
			return string;
		}
		return addWordBoundary( string, true, extraBoundary );
	} );

	const regexString = "(" + boundedArray.join( ")|(" ) + ")";

	return new RegExp( regexString, "ig" );
} );

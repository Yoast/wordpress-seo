/** @module stringProcessing/stringToRegex */
import { isUndefined } from "lodash-es";
import replaceDiacritics from "../stringProcessing/replaceDiacritics.js";
import addWordBoundary from "../stringProcessing/addWordboundary.js";
import sanitizeString from "../stringProcessing/sanitizeString";

import { escapeRegExp } from "lodash-es";
import { memoize } from "lodash-es";

/**
 * Creates a regex from a string so it can be matched everywhere in the same way.
 *
 * @param {string} string The string to make a regex from.
 * @param {string} [extraBoundary=""] A string that is used as extra boundary for the regex.
 * @param {boolean} [doReplaceDiacritics=true] If set to false, it doesn't replace diacritics. Defaults to true.
 * @returns {RegExp} regex The regex made from the keyword
 */
export default memoize( function( string, extraBoundary, doReplaceDiacritics ) {
	if ( isUndefined( extraBoundary ) ) {
		extraBoundary = "";
	}

	if ( isUndefined( doReplaceDiacritics ) || doReplaceDiacritics === true ) {
		string = replaceDiacritics( string );
	}

	string = sanitizeString( string );
	string = escapeRegExp( string );
	string = addWordBoundary( string, false, extraBoundary );
	return new RegExp( string, "ig" );
} );

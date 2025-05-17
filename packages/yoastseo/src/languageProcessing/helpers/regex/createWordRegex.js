/** @module stringProcessing/stringToRegex */
import { escapeRegExp, isUndefined, memoize } from "lodash";
import sanitizeString from "../sanitize/sanitizeString";
import replaceDiacritics from "../transliterate/replaceDiacritics.js";
import addWordBoundary from "../word/addWordboundary.js";

/**
 * Creates a regex from a string so it can be matched everywhere in the same way.
 *
 * @param {string}  string                     The string to make a regex from.
 * @param {string}  [extraBoundary=""]         A string that is used as extra boundary for the regex.
 * @param {boolean} [doReplaceDiacritics=true] If set to false, it doesn't replace diacritics. Defaults to true.
 *
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

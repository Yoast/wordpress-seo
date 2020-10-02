/*
 * \u2014 - em-dash
 * \u00d7 - multiplication sign
 * \u002b - plus sign
 * \u0026 - ampersand
 * \u06d4 - Urdu full stop
 * \u061f - Arabic question mark
 * \u060C - Arabic comma
 * \u061B - Arabic semicolon
 */
var punctuationRegexString = "[\\–\\-\\(\\)_\\[\\]’“”\"'.?!:;,¿¡«»‹›\u2014\u00d7\u002b\u0026\u06d4\u061f\u060C\u061B\\<\>]+";
var punctuationRegexStart = new RegExp( "^" + punctuationRegexString );
var punctuationRegexEnd = new RegExp( punctuationRegexString + "$" );

/**
 * Replaces punctuation characters from the given text string.
 *
 * @param {String} text The text to remove the punctuation characters for.
 *
 * @returns {String} The sanitized text.
 */
export default function( text ) {
	text = text.replace( punctuationRegexStart, "" );
	text = text.replace( punctuationRegexEnd, "" );

	return text;
}

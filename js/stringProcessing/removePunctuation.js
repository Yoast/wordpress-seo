// These are sentence terminators, that never should be in the middle of a word.
var sentenceTerminators = /[.?!:;,]/g;

// Replace all other punctuation chars at the beginning or at the end of a word.
var punctuationRegexString = "[\-()_\\[\\]’“”\"'\/]";
var punctuationRegexStart = new RegExp( "^" + punctuationRegexString );
var punctuationRegexEnd = new RegExp( punctuationRegexString + "$" );

/**
 * Replaces punctuation chars from the given text string.
 *
 * @param {String} text The text to remove the punctuation chars for.
 *
 * @returns {String} The sanitized text.
 */
module.exports = function( text ) {
	text = text.replace( sentenceTerminators, "" );
	text = text.replace( punctuationRegexStart, "" );
	text = text.replace( punctuationRegexEnd, "" );

	return text;
};

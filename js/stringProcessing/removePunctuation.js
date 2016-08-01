// Replace all other punctuation characters at the beginning or at the end of a word.
var punctuationRegexString = "[\\–\\-\\(\\)_\\[\\]’“”\"'.?!:;,¿¡«»]+";
var punctuationRegexStart = new RegExp( "^" + punctuationRegexString );
var punctuationRegexEnd = new RegExp( punctuationRegexString + "$" );

/**
 * Replaces punctuation characters from the given text string.
 *
 * @param {String} text The text to remove the punctuation characters for.
 *
 * @returns {String} The sanitized text.
 */
module.exports = function( text ) {
	text = text.replace( punctuationRegexStart, "" );
	text = text.replace( punctuationRegexEnd, "" );

	return text;
};

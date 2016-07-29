// Replace all other punctuation chars at the beginning or at the end of a word.
var punctuationRegexString = "[\\–\\-\\(\\)_\\[\\]’“”\"'.?!:;,¿¡«»]+";
var punctuationRegexStart = new RegExp( "^" + punctuationRegexString );
var punctuationRegexEnd = new RegExp( punctuationRegexString + "$" );

/**
 * Replaces punctuation chars from the given word string.
 *
 * @param {String} word The word to remove the punctuation chars for.
 *
 * @returns {String} The sanitized word.
 */
module.exports = function( word ) {
	word = word.replace( punctuationRegexStart, "" );
	word = word.replace( punctuationRegexEnd, "" );

	return word;
};

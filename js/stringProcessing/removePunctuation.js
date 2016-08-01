// Replace all other punctuation characters at the beginning or at the end of a word.
var punctuationRegexString = "[\\–\\-\\(\\)_\\[\\]’“”\"'.?!:;,¿¡«»]+";
var punctuationRegexStart = new RegExp( "^" + punctuationRegexString );
var punctuationRegexEnd = new RegExp( punctuationRegexString + "$" );

/**
 * Replaces punctuation characters from the given word string.
 *
 * @param {String} word The word to remove the punctuation characters for.
 *
 * @returns {String} The sanitized word.
 */
module.exports = function( word ) {
	word = word.replace( punctuationRegexStart, "" );
	word = word.replace( punctuationRegexEnd, "" );

	return word;
};

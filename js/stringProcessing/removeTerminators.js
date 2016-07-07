var terminatorRegexString = "[\-()_\\[\\]’“”\"'\/.?!:;,¿¡]";
var terminatorRegexStart = new RegExp( "^" + terminatorRegexString + "+" );
var terminatorRegexEnd = new RegExp( terminatorRegexString + "+$" );

/**
 * Removes sentence terminators at the beginning and end of a sentence.
 *
 * @param {String} word The word to remove terminators from.
 * @returns {String} The word without terminators.
 */
module.exports = function( word ) {
	word = word.replace( terminatorRegexStart, "" );
	word = word.replace( terminatorRegexEnd, "" );
	return word;
};

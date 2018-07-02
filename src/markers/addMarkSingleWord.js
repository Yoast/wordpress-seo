const stripWordBoundaries = require( "../stringProcessing/stripWordBoundaries" ).stripWordBoundariesStart;

/**
 * Marks a text with HTML tags, deals with word boundaries that were matched by regexes, but which should not be marked.
 *
 * @param {string} text The unmarked text.
 *
 * @returns {string} The marked text.
 */
module.exports = function( text ) {
	const strippedText = stripWordBoundaries( text );
	let wordBoundary = "";

	if ( ! ( strippedText === text ) ) {
		wordBoundary = text.substr( 0, text.search( strippedText ) );
	}

	return wordBoundary + "<yoastmark class='yoast-text-mark'>" + strippedText + "</yoastmark>";
};

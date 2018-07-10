const { stripWordBoundariesStart, stripWordBoundariesEnd } = require( "../stringProcessing/stripWordBoundaries" );

/**
 * Marks a text with HTML tags, deals with word boundaries that were matched by regexes, but which should not be marked.
 *
 * @param {string} text The unmarked text.
 *
 * @returns {string} The marked text.
 */
module.exports = function( text ) {
	// Strip the word boundaries at the start of the text.
	const strippedTextStart = stripWordBoundariesStart( text );
	let wordBoundaryStart = "";
	let wordBoundaryEnd = "";

	// Get the actual word boundaries from the start of the text.
	if ( strippedTextStart !== text ) {
		const wordBoundaryStartIndex = text.search( strippedTextStart );
		wordBoundaryStart = text.substr( 0, wordBoundaryStartIndex );
	}

	// Strip word boundaries at the end of the text.
	const strippedTextEnd = stripWordBoundariesEnd( strippedTextStart );
	// Get the actual word boundaries from the end of the text.
	if ( strippedTextEnd !== strippedTextStart ) {
		const wordBoundaryEndIndex = strippedTextStart.search( strippedTextEnd ) + strippedTextEnd.length;
		wordBoundaryEnd = strippedTextStart.substr( wordBoundaryEndIndex );
	}

	return wordBoundaryStart + "<yoastmark class='yoast-text-mark'>" + strippedTextEnd + "</yoastmark>" + wordBoundaryEnd;
};

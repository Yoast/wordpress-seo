var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var matchWordInSentence = require( "../stringProcessing/matchWordInSentence.js" );

/**
 * Returns the indices of a string in a text. If it is found multiple times, it will return multiple indices.
 *
 * @param {string} part The part to find in the text.
 * @param {string} text The text to check for parts.
 * @returns {Array} All indices found.
 */
function getIndices( part, text ) {
	var startIndex = 0;
	var searchStringLength = part.length;
	var index, indices = [];
	while ( ( index = text.indexOf( part, startIndex ) ) > -1 ) {
		indices.push(
			{
				index: index,
				match: part,
			}
		);
		startIndex = index + searchStringLength;
	}
	return indices;
}

/**
 * Matches string with an array, returns the word and the index it was found on.
 *
 * @param {string} sentence The sentence to match the strings from the array to.
 * @param {Array} matches The array with strings to match.
 * @returns {Array} The array with matches, containing the index of the match and the matched string.
 * Returns an empty array if none are found.
 */
var getIndicesOfList = function( sentence, matches ) {
	var matchedParts = [];

	forEach( matches, function( part ) {
		part = stripSpaces( part );
		if ( ! matchWordInSentence( part, sentence ) ) {
			return;
		}
		matchedParts = matchedParts.concat( getIndices( part, sentence ) );
	} );

	return matchedParts;
};

/**
 * Sorts the array on the index property of each entry.
 *
 * @param {Array} indices The array with indices.
 * @returns {Array} The sorted array with indices.
 */
var sortIndices = function( indices ) {
	return indices.sort( function( a, b ) {
		return ( a.index > b.index );
	} );
};

/**
 * Filters duplicate entries if the indices overlap.
 *
 * @param {Array} indices The array with indices to be filtered.
 * @returns {Array} The filtered array.
 */
var filterIndices = function( indices ) {
	indices = sortIndices( indices );
	for ( var i = 0; i < indices.length; i++ ) {
		// If the next index is within the range of the current index and the length of the word, remove it
		// This makes sure we don't match combinations twice, like "even though" and "though".
		if ( ! isUndefined( indices[ i + 1 ] ) && indices[ i + 1 ].index < indices[ i ].index + indices[ i ].match.length ) {
			indices.pop( i + 1 );
		}
	}
	return indices;
};

module.exports = {
	getIndices: getIndices,
	getIndicesOfList: getIndicesOfList,
	filterIndices: filterIndices,
	sortIndices: sortIndices,
};

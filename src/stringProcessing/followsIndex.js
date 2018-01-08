var isEmpty = require( "lodash/isEmpty" );
var forEach = require( "lodash/forEach" );
var includes = require( "lodash/includes" );

/**
 * Checks whether a given word is followed by any word from a given list.
 *
 * @param {Array} followingWords The array of objects with matches and indices.
 * @param {Object} match The object with the match and index to test the following words for.
 *
 * @returns {boolean} Returns true if the match is followed by a given word, otherwise returns false.
 */
module.exports = function( followingWords, match ) {
	if ( isEmpty( followingWords ) ) {
		return false;
	}

	// The followingWordIndices include the preceding space.
	var wordAfterMatchIndex = match.index + match.match.length;
	var followingWordsIndices = [];

	forEach( followingWords, function( followingWord ) {
		followingWordsIndices.push( followingWord.index );
	} );

	return includes( followingWordsIndices, wordAfterMatchIndex );
};

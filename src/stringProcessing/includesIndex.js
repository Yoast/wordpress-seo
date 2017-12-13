var isEmpty = require( "lodash/isEmpty" );
var forEach = require( "lodash/forEach" );
var includes = require( "lodash/includes" );

/**
 * Checks whether a given word is directly preceded by a word from a list of words.
 *
 * @param {Array} precedingWords The array of objects with matches and indices.
 * @param {number} matchIndex The index of the word for which to check whether it's preceded by one of the other words.
 *
 * @returns {boolean} Returns true if the match is preceded by a given word, otherwise returns false.
 */

module.exports = function( precedingWords, matchIndex ) {
	if ( isEmpty( precedingWords ) ) {
		return false;
	}

	var precedingWordsEndIndices = [];
	forEach( precedingWords, function( precedingWord ) {
		// + 1 because the end word boundary is not included in the match.
		var precedingWordsEndIndex = precedingWord.index + precedingWord.match.length + 1;
		precedingWordsEndIndices.push( precedingWordsEndIndex );
	} );

	return includes( precedingWordsEndIndices, matchIndex );
};

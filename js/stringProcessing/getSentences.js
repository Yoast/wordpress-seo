var filter = require( "lodash/filter" );
var isEmpty = require( "lodash/isEmpty" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var isNaN = require( "lodash/isNaN" );

/**
 * Checks if the period is followed with a whitespace. If not, it is no ending of a sentence.
 *
 * @param {string} text The text to split in sentences.
 * @param {number} index The current index to look for.
 * @returns {boolean} True if it doesn't match a whitespace.
 */
var invalidateOnWhiteSpace = function( text, index ) {
	return text.substring( index + 1 ).match( /\s/ ) === null;
};

/**
 * Checks if the character in the next sentence is a capital letter or a number. If not, this period is not the end
 * of a sentence.
 *
 * @param {string} text The text to split in sentences.
 * @param {Array} positions The array with positions of periods in the text.
 * @param {number} i The current iterator.
 * @returns {boolean} False if it doesn't match a capital.
 */
var invalidateOnCapital = function( text, positions, i ) {

	// The current index + 2 should be the first character of the new sentence. We use a range of 1, since we only need the first character.
	var firstChar = text.substring( positions[ i ] + 2, positions[ i ] + 3 );

	// If a sentence starts with a number or a whitespace, it shouldn't invalidate
	if ( firstChar === firstChar.toLocaleLowerCase() && isNaN( parseInt( firstChar, 10 ) ) && firstChar.match( /\s/ ) === null ) {
		return true;
	}
};

/**
 * Filters the positions that aren't valid endings to sentences.
 * @param {string} text The text to split in sentences.
 * @param {Array} positions The array with positions of periods in the text.
 * @returns {Array} The filtered positions.
 */
var filterPositions = function( text, positions ) {
	return filter( positions, function( position, index ) {
		if ( !isUndefined( positions[ index + 1 ] ) ) {
			if ( invalidateOnWhiteSpace( text, positions[ index ] ) || invalidateOnCapital( text, positions, index ) ) {
				return false;
			}
		}
		return true;
	} );
};

/**
 * Split sentences based on index.
 *
 * @param {Array} positions The array with positions of periods in the text.
 * @param {string} text The text to split in sentences.
 * @returns {Array} Array with sentences.
 */
var splitOnIndex = function( positions, text ) {
	var curIndex = 0, sentences = [];

	forEach( positions, function( index ) {
		sentences.push( text.substring( curIndex, index ) );

		// Adds 1 to skip the period.
		curIndex = index + 1;
	} );
	return sentences;
};

/**
 * Returns sentences in a string.
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
module.exports = function( text ) {

	// Store the original text before changing terminators, so we can return the unaltered sentences.
	var originalText = text;

	// Unify all terminators.
	text = text.replace( /[.?!:]/g, "." );

	// Add period in case it is missing.
	text += ".";

	var positions = [];
	var periodIndex = text.indexOf( "." );
	while ( periodIndex > -1 ) {
		positions.push( periodIndex );
		periodIndex = text.indexOf( ".", periodIndex + 1 );
	}
	positions = filterPositions( originalText, positions );
	var sentences = splitOnIndex( positions, originalText );

	return filter( sentences, function( sentence ) {
		return ( !isEmpty( sentence ) );
	} );
};

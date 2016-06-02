var filter = require( "lodash/filter" );
var map = require( "lodash/map" );
var isEmpty = require( "lodash/isEmpty" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var isNaN = require( "lodash/isNaN" );

var getSubheadings = require( "./getSubheadings.js" ).getSubheadings;

// All characters that indicate a sentence delimiter.
var sentenceDelimiters = ".?!:;";

var afterPointRegex = /\s|</;

/**
 * Checks if the period is followed with a whitespace or < for an html-tag. If not, it is no ending of a sentence.
 *
 * @param {string} text The text to split in sentences.
 * @param {number} index The current index to look for.
 * @returns {boolean} True if it doesn't match a whitespace or < .
 */
var invalidateOnWhiteSpace = function( text, index ) {
	return text.substring( index, index + 1 ).match( afterPointRegex ) === null;
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

	if ( text.substring( positions[ i ], positions[ i ] + 1 ) === "<" ) {
		return false;
	}

	// The current index + 1 should be the first character of the new sentence. We use a range of 1, since we only need the first character.
	var firstChar = text.substring( positions[ i ] + 1, positions[ i ] + 2 );

	// If a sentence starts with a number or a whitespace, it shouldn't invalidate
	if ( firstChar === firstChar.toLocaleLowerCase() && isNaN( parseInt( firstChar, 10 ) ) && firstChar.match( afterPointRegex ) === null ) {
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

		curIndex = index;
	} );
	return sentences;
};

/**
 * Finds subheadings in each sentence and returns each position.
 * @param {string} text The sentence to check for subheadings.
 * @returns {Array} The position of each subsentence.
 */
var findSubheadings = function( text ) {
	var subheadings = getSubheadings( text );
	return map( subheadings, function( subheading ) {
		return subheading.index + subheading[ 0 ].length;
	} );
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
	text = text.replace( new RegExp( "[" + sentenceDelimiters + "]", "g" ), "." );

	// Add period in case it is missing.
	text += ".";
	var positions = [];
	var periodIndex = text.indexOf( "." );
	while ( periodIndex > -1 ) {
		positions.push( periodIndex + 1 );
		periodIndex = text.indexOf( ".", periodIndex + 1 );
	}
	positions = filterPositions( originalText, positions );

	// Add the positions of subheadings.
	positions = positions.concat( findSubheadings( text ) );
	positions = positions.sort( function( a, b ) {
		return a - b;
	} );
	var sentences = splitOnIndex( positions, originalText );

	// Clean sentences by stripping HTMLtags.
	sentences = map( sentences, function( sentence ) {
		return sentence.replace( /^\s/, "" );
	} );

	return filter( sentences, function( sentence ) {
		return ( !isEmpty( sentence ) );
	} );
};

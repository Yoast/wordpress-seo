var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

var filter = require( "lodash/filter" );
var isEmpty = require( "lodash/isEmpty" );
var isUndefined = require( "lodash/isUndefined" );
var difference = require( "lodash/difference" );
var forEach = require( "lodash/forEach" );
var isNaN = require( "lodash/isNaN" );

/**
 * Checks if the period is followed with a whitespace. If not, it is no ending of a sentence.
 *
 * @param {string} text The text to split in sentences
 * @param {number} index The current index to look for.
 * @returns {boolean} True if it doesn't match a whitespace.
 */
var inValidateOnWhiteSpace = function( text, index ) {
	return text.substring( index + 1 ).match( /\s/ ) === null;
};

/**
 * Checks if the character in the next sentence is a capital letter or a number. If not, this period is not the end
 * of a sentence.
 *
 * @param {string} text The text to split in sentences
 * @param {Array} indices The array with indices of periods in the text.
 * @param {number} i The current iterator.
 * @returns {boolean} False if it doesn't match a capital.
 */
var inValidateOnCapital = function( text, indices, i ) {
	var firstChar = text.substring( indices[ i ] + 2, indices[ i  ] + 3 );
	if( firstChar === firstChar.toLocaleLowerCase() && isNaN( parseInt( firstChar, 10 ) ) ) {
		return true;
	}
};

/**
 * Filters the indices that aren't valid endings to sentences.
 * @param {string} text The text to split in sentences.
 * @param {Array} indices The array with indices of periods in the text.
 * @returns {Array} The filtered indices.
 */
var filterIndices = function( text, indices ) {
	var filteredIndices = [];
	for ( var i = 0; i < indices.length; i++ ) {
		if( !isUndefined( indices[ i + 1 ] ) ) {
			if ( inValidateOnWhiteSpace( text, indices[ i ] ) ) {
				filteredIndices.push( indices[ i ] );
			}
			if ( inValidateOnCapital( text, indices, i ) ) {
				filteredIndices.push( indices[ i ] );
			}
		}
	}

	// Returns the difference between the indices, and the filtered indices, being the correct indices.
	return difference( indices, filteredIndices );
};

/**
 * Split sentences based on index.
 *
 * @param {Array} indices The array with indices of periods in the text.
 * @param {string} text The text to split in sentences.
 * @returns {Array} Array with sentences.
 */
var splitOnIndex = function( indices, text ) {
	var curIndex = 0, sentences = [];

	forEach( indices, function( index ) {
		sentences.push( text.substring( curIndex, index ) );

		// Adds 1 to skip the period.
		curIndex = index + 1;
	} );
	return sentences;
};

/**
 * Unifies terminators and strip spaces
 *
 * @param {String} text The string to clean.
 * @returns {String} The cleaned text.
 */
var cleanText = function( text ) {
	if( text === "" ) {
		return text;
	}

	// Unify all terminators.
	text = text.replace( /[.?!]/g, "." );

	// Add period in case it is missing.
	text += ".";

	// Remove double spaces
	text = stripSpaces( text );

	return text;
};

/**
 * Returns sentences in a string.
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
module.exports = function( text ) {
	text = cleanText( text );

	var indices = [];
	var periodIndex = text.indexOf( "." );
	while( periodIndex > -1 ) {
		indices.push( periodIndex );
		periodIndex = text.indexOf( ".", periodIndex + 1 );
	}
	indices = filterIndices( text, indices );
	var sentences = splitOnIndex( indices, text );

	return filter( sentences, function( sentence ) {
		return( !isEmpty( sentence ) );
	} );
};

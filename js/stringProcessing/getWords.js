/** @module stringProcessing/countWords */

var stripTags = require( "./stripHTMLTags.js" );
var stripSpaces = require( "./stripSpaces.js" );
var removeTerminators = require( "./removeTerminators.js" );
var map = require( "lodash/map" );
var filter = require( "lodash/filter" );

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @returns {Array} The array with all words.
 */
module.exports = function( text ) {
	text = stripSpaces( stripTags( text ) );
	if ( text === "" ) {
		return [];
	}

	var words = text.split( /\s/g );

	words = map( words, function( word ) {
		return removeTerminators( word );
	} );

	return filter( words, function( word ) {
		return word.trim() !== "";
	} );
};


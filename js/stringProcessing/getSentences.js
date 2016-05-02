var cleanText = require( "../stringProcessing/cleanText.js" );
var filter = require( "lodash/filter" );
var isEmpty = require( "lodash/isEmpty" );

/**
 * Returns sentences in a string.
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
module.exports = function( text ) {
	var cleanedText = cleanText( text );
	var sentences = cleanedText.split( "." );
	return filter( sentences, function( sentence ) {
		return(  !isEmpty( sentence ) );
	} );
};

/** @module stringProcessing/createRegexFromArray */

var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} disableWordBoundary
 * @returns {string} regex The regex created from the array.
 */
module.exports = function( array, disableWordBoundary ) {
	var regexString;

	array = array.map( function( string ) {
		if ( disableWordBoundary ) {
			return string;
		} else {
			return addWordBoundary( string );
		}
	}.bind( this ) );

	regexString = "(" + array.join( ")|(" ) + ")";

	return new RegExp( regexString, "ig" );
};

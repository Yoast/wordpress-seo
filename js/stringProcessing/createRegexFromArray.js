/** @module stringProcessing/createRegexFromArray */

var addWordBoundary = require( "stringProcessing/addWordboundary.js" );

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} disableWordBoundary Boolean indicating whether or not to disable word boundaries
 * @returns {RegExp} regex The regex created from the array.
 */
module.exports = function( array, disableWordBoundary ) {
	var regexString;

	array = array.map( function( string ) {
		if ( disableWordBoundary ) {
			return string;
		} else {
			return addWordBoundary( string );
		}
	} );

	regexString = "(" + array.join( ")|(" ) + ")";

	return new RegExp( regexString, "ig" );
};

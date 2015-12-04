var addWordBoundary = require( "../stringProcessing/addWordBoundary.js" );

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {Array} array The array with strings
 * @param {Bool} disableWordBoundary
 * @returns {String} regex The regex created from the array.
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

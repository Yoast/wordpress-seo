/** @module stringProcessing/createRegexFromDoubleArray */

var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

/**
 * Creates a regex string of combined strings from the input array.
 * @param {array} array The array containing the various parts of a transition word combination.
 * @returns {array} The array with replaced entries.
 */
var wordCombinationToRegexString = function( array ) {
	array = array.map( function( word ) {
		return addWordBoundary( word );
	} );
	return array.join( "(.*?)" );
};

/**
 * Creates a regex of combined strings from the input array, containing arrays with two entries.
 * @param {array} array The array containing arrays.
 * @returns {RegExp} The regex created from the array.
 */
module.exports = function ( array ) {
	array = array.map( function( wordCombination ) {
		return wordCombinationToRegexString( wordCombination );
	} );
	var regexString = "(" + array.join( ")|(" ) + ")";
	return new RegExp ( regexString, "ig" );
};

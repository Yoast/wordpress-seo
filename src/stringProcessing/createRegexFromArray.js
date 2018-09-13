/** @module stringProcessing/createRegexFromArray */

import addWordBoundary from "../stringProcessing/addWordboundary.js";

import { map } from "lodash-es";

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} [disableWordBoundary] Boolean indicating whether or not to disable word boundaries
 * @returns {RegExp} regex The regex created from the array.
 */
export default function( array, disableWordBoundary ) {
	var regexString;
	var _disableWordBoundary = disableWordBoundary || false;

	var boundedArray = map( array, function( string ) {
		if ( _disableWordBoundary ) {
			return string;
		}
		return addWordBoundary( string, true );
	} );

	regexString = "(" + boundedArray.join( ")|(" ) + ")";

	return new RegExp( regexString, "ig" );
}

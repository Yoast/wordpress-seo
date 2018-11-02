/** @module stringProcessing/createRegexFromArray */

import addWordBoundary from "../stringProcessing/addWordboundary.js";

import { map } from "lodash-es";

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} [disableWordBoundary] Boolean indicating whether or not to disable word boundaries
 * @param {"all"|"start"|"end"} [matchType="all"] If the regex should match either the entire string, the start or the end.
 * @returns {RegExp} regex The regex created from the array.
 */
export default function( array, disableWordBoundary, matchType = "all" ) {
	var regexString;
	var _disableWordBoundary = disableWordBoundary || false;

	var boundedArray = map( array, function( string ) {
		if ( _disableWordBoundary ) {
			return string;
		}
		return addWordBoundary( string, true );
	} );

	regexString = "(" + boundedArray.join( ")|(" ) + ")";

	switch ( matchType ) {
		case "start" :
			regexString = "^(" + regexString + ")";
			break;
		case "end" :
			regexString = "(" + regexString + ")$";
			break;
		default:
			break;
	}

	return new RegExp( regexString, "ig" );
}

/** @module stringProcessing/getAlttagContent */

import stripSpaces from "../sanitize/stripSpaces.js";

const regexAltTag = /alt=(['"])(.*?)\1/i;

/**
 * Checks for an alt tag in the image and returns its content
 *
 * @param {String} text Text string to match alt
 * @returns {String} the contents of the alt tag, empty if none is set.
 */
export default function( text ) {
	let alt = "";

	const matches = text.match( regexAltTag );

	if ( matches !== null ) {
		alt = stripSpaces( matches[ 2 ] );

		alt = alt.replace( /&quot;/g, "\"" );
		alt = alt.replace( /&#039;/g, "'" );
	}
	return alt;
}

/** @module stringProcessing/divisionInText */

import matchStringWithRegex from "../regex/matchStringWithRegex.js";

const EmptyDivRegex = new RegExp( "<div(?:[^>]+)?> *</div>", "ig" );

/**
 * Checks the text for empty divisions.
 *
 * @param {string} text The text string to check for empty divisions.
 *
 * @returns {Array} Array containing all empty divisions.
 */
export default function( text ) {
	return matchStringWithRegex( text, EmptyDivRegex );
}

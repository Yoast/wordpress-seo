/** @module stringProcessing/divisionInText */

import matchStringWithRegex from "./matchStringWithRegex.js";

/**
 * Checks the text for empty divisions.
 *
 * @param {string} text The textstring to check for empty divisions
 * @returns {Array} Array containing all empty divisions
 */
export default function( text ) {
	return matchStringWithRegex( text, "<div(?:[^>]+)?> *</div>" );
}

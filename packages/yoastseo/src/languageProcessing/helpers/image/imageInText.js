/** @module stringProcessing/imageInText */

import matchStringWithRegex from "../regex/matchStringWithRegex.js";

export const imageRegex = "<img(?:[^>]+)?>";

/**
 * Checks the text for images.
 *
 * @param {string} text The text string to check for images
 * @returns {Array} Array containing all types of found images
 */
export default function( text ) {
	return matchStringWithRegex( text, imageRegex );
}

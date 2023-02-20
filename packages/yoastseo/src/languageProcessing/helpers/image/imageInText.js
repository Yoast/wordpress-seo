/** @module stringProcessing/imageInText */

import matchStringWithRegex from "../regex/matchStringWithRegex.js";

/**
 * @returns {object} A precompiled regex for recognizing self closing image tags.
 */
export const imageRegex = new RegExp( "<img(?:[^>]+)?>(</img>)*", "ig" );


/**
 * Checks the text for images.
 *
 * @param {string} text The text string to check for images
 * @returns {Array} Array containing all types of found images
 */
export default function( text ) {
	return matchStringWithRegex( text, imageRegex );
}

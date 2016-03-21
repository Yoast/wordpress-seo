/** @module researches/imageInText */

var imageInText = require( "./imageInText" );

/**
 * Checks the amount of images in the text.
 *
 * @param {string} text The textstring to check for images
 * @returns {number} The amount of found images
 */
module.exports = function( text ) {
	return imageInText( text ).length;
};

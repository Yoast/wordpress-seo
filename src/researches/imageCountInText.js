/** @module researches/imageInText */

var imageInText = require( "./../stringProcessing/imageInText" );

/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images
 * @returns {number} The amount of found images
 */
module.exports = function( paper ) {
	return imageInText( paper.getText() ).length;
};

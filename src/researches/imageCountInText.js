/** @module researches/imageInText */

import imageInText from './../stringProcessing/imageInText';

/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images
 * @returns {number} The amount of found images
 */
export default function( paper ) {
	return imageInText( paper.getText() ).length;
};

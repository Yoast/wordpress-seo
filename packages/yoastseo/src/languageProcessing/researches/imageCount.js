/** @module researches/imageInText */

import imageInText from "../helpers/image/imageInText";

/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images.
 *
 * @returns {number} The amount of found images.
 */
export default function imageCount( paper ) {
	return imageInText( paper.getText() ).length;
}

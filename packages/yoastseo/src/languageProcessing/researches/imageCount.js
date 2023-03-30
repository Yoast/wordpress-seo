/** @module researches/imageInText */

import imagesInTree from "../helpers/image/imagesInTree";

/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images.
 *
 * @returns {number} The amount of found images.
 */
export default function imageCount( paper ) {
	const images = imagesInTree( paper );

	return images.length;
}

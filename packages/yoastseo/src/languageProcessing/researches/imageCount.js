/** @module researches/imageInText */

import getImagesInTree from "../helpers/image/getImagesInTree";

/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images.
 *
 * @returns {number} The amount of found images.
 */
export default function imageCount( paper ) {
	const images = getImagesInTree( paper );

	return images.length;
}

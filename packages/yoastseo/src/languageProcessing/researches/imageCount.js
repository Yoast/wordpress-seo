/** @module researches/imageInText */

import getImagesInScope from "../helpers/image/getImagesInScope";

/**
 * Checks the amount of images in scope: the images in the text, unless the Paper
 * carries a `productImages` attribute (see `getImagesInScope`).
 *
 * @param {Paper} paper The paper to check for images.
 *
 * @returns {number} The amount of found images.
 */
export default function imageCount( paper ) {
	const images = getImagesInScope( paper );

	return images.length;
}

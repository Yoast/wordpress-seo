/** @module researches/imageInText */

import getImagesInScope from "../helpers/image/getImagesInScope";

/**
 * Checks the amount of images in scope: the images in the text, unless the researcher's
 * `imageScope` config points at the Paper's product images.
 *
 * @param {Paper}       paper           The paper to check for images.
 * @param {Researcher}  [researcher]    The researcher carrying the `imageScope` config.
 *
 * @returns {number} The amount of found images.
 */
export default function imageCount( paper, researcher ) {
	const images = getImagesInScope( paper, researcher );

	return images.length;
}

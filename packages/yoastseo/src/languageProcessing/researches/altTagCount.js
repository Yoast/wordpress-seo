/** @module researches/imageAltTags */

import { findAllInTree } from "../../parse/traverse";
import { hasAttribute, attributeEmpty } from "../../parse/helpers";

/**
 * Checks the number of images with no alt text.
 *
 * @param {Paper} paper The paper to check for images.
 *
 * @returns {object} An object containing the total number of images and the number of images that have no alt text.
 */
export default function altTagCount( paper ) {
	const images = findAllInTree(
		paper.getTree(),
		node => node.nodeName === "img"
	);

	const imagesWithNoAltText = images.filter(
		image => ! hasAttribute( image, "alt" ) || attributeEmpty( image, "alt" )
	);

	return {
		totalNrOfImages: images.length,
		nrOfImagesWithNoAlt: imagesWithNoAltText.length,
	};
}

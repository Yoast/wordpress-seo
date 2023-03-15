/** @module researches/imageInText */

import { findAllInTree } from "../../parse/traverse";

/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images.
 *
 * @returns {number} The amount of found images.
 */
export default function imageCount( paper ) {
	const images = findAllInTree(
		paper.getTree(),
		node => node.nodeName === "img"
	);

	return images.length;
}

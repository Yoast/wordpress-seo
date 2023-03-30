/** @module researches/imageInText */

/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images.
 *
 * @returns {number} The amount of found images.
 */
export default function imageCount( paper ) {
	const tree = paper.getTree();

	if ( ! tree ) {
		return 0;
	}

	const images = tree.findAll( node => node.name === "img" );

	return images.length;
}

import findAllInTree from "../../../parse/findAllTree";

/** @module stringProcessing/getAnchorsFromText */

/**
 * Check for anchors in the text string and returns them in an array.
 *
 * @param {Object} tree 	The html-tree representation of the text text to check for matches.
 *
 * @returns {Array} The matched links in text.
 */
export default function( tree ) {
	const links = findAllInTree(
		tree,
		node => node.nodeName === "a"
	);

	return links;
}

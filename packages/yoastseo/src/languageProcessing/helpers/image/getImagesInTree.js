/**
 * Checks the tree for images.
 *
 * @param {Paper}       paper       The paper to check for images.
 *
 * @returns {Array} Array containing all images in the tree
 */
export default function( paper ) {
	const tree = paper.getTree();

	if ( ! tree ) {
		return [];
	}

	return tree.findAll( node => node.name === "img" );
}

import Research from "./Research";

/**
 * A research giving back the headings located in a text.
 */
class Headings extends Research {

	/**
	 * Calculates the result of the research for the given Node.
	 *
	 * @param {module:tree/structure.Node} node The node to calculate the research for.
	 *
	 * @returns {Promise<*>} The result of the research.
	 *
	 * @abstract
	 */
	calculateFor( node ) {
		return undefined;
	}

	/**
	 * Checks if the given node is a leaf node for this research.
	 *
	 * @param {module:tree/structure.Node} node The node to check.
	 *
	 * @returns {boolean} If the given node is considered a leaf node for this research.
	 *
	 * @abstract
	 */
	isLeafNode( node ) {
		return false;
	}

	/**
	 * Merges results of this research according to a predefined strategy.
	 *
	 * @param {Array<*>} results The results of this research to merge.
	 *
	 * @returns {*} The merged results.
	 *
	 * @abstract
	 */
	mergeChildrenResults( results ) {
		return undefined;
	}
}

export default Headings;

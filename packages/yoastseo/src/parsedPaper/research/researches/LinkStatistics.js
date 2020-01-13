import Research from "./Research";

/**
 * Calculates link statistics.
 * E.g. which links a node or its children contains, and whether these links are:
 *  * internal (points to a page in the same domain), external (a page in another domain) or other.
 *  * marked as follow (search engines are allowed to follow this link) or no-follow (search engines are not allowed to follow the link).
 *
 *  @memberOf module:parsedPaper/research
 */
class LinkStatistics extends Research {
	/**
	 * Calculates link statistics for the given node.
	 *
	 * @param {module:parsedPaper/structure.Node} node The node to calculate the research for.
	 *
	 * @returns {Promise<Object[]>} The research results.
	 */
	calculateFor( node ) {
		return undefined;
	}

	/**
	 * Whether the given node is considered a leaf node for this research.
	 *
	 * @param {module:parsedPaper/structure.Node} node The node to test.
	 *
	 * @returns {boolean} Whether the given node is considered a leaf node for this research.
	 */
	isLeafNode( node ) {
		return false;
	}

	/**
	 * Merges the given research results.
	 *
	 * @param {Object[]} results The results to merge
	 *
	 * @returns {Promise<Object[]>} The merged results.
	 */
	mergeChildrenResults( results ) {
		return undefined;
	}
}

export default LinkStatistics;

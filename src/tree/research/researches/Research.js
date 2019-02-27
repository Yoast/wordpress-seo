/**
 * A research that can be applied to the tree.
 *
 * @memberOf module:tree/research
 *
 * @abstract
 */
class Research {
	/**
	 * Checks if the given node is a leaf node for this research.
	 *
	 * @param {module:tree/structure.Node} node The node to check.
	 *
	 * @returns {boolean} If the given node is considered a leaf node for this research.
	 *
	 * @abstract
	 */
	isLeafNode( node ) { // eslint-disable-line no-unused-vars
		console.warn( "isLeafNode should be implemented by a child class of Researcher." );
	}

	/**
	 * Calculates the result of the research for the given Node.
	 *
	 * @param {module:tree/structure.Node} node The node to calculate the research for.
	 *
	 * @returns {Promise<*>} The result of the research.
	 *
	 * @abstract
	 */
	calculateFor( node ) { // eslint-disable-line no-unused-vars
		console.warn( "calculateFor should be implemented by a child class of Researcher." );
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
	mergeChildrenResults( results ) { // eslint-disable-line no-unused-vars
		console.warn( "mergeChildrenResults should be implemented by a child class of Researcher." );
	}
}

export default Research;

import { flatten } from "lodash";
import { LeafNode } from "../../structure/tree";

/**
 * A research that can be applied to the tree.
 *
 * @memberOf module:parsedPaper/research
 *
 * @abstract
 */
class Research {
	/**
	 * Checks if the given node is a leaf node for this research.
	 *
	 * @param {module:parsedPaper/structure.Node} node The node to check.
	 *
	 * @returns {boolean} If the given node is considered a leaf node for this research.
	 *
	 */
	isLeafNode( node ) {
		return node instanceof LeafNode;
	}

	/**
	 * Calculates the result of the research for the given Node.
	 *
	 * @param {module:parsedPaper/structure.Node} node The node to calculate the research for.
	 * @param {module:parsedPaper/structure.Node} metadata The document's metadata.
	 *
	 * @returns {Promise<*>} The result of the research.
	 *
	 * @abstract
	 */
	calculateFor( node, metadata ) { // eslint-disable-line no-unused-vars
		console.warn( "calculateFor should be implemented by a child class of Researcher." );
	}

	/**
	 * Merges results of this research according to a predefined strategy.
	 *
	 * @param {Array<*>} results The results of this research to merge.
	 *
	 * @returns {*} The merged results.
	 */
	mergeChildrenResults( results ) {
		return flatten( results );
	}
}

export default Research;

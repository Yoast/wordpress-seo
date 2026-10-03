import { sum } from "lodash";
import Research from "../../../src/parsedPaper/research/researches/Research";
import { LeafNode } from "../../../src/parsedPaper/structure/tree";

/**
 * A researcher used for testing.
 */
class TestResearch extends Research {
	/**
	 * Counts the number of tokens
	 * (text is split on whitespace).
	 *
	 * @param {module:parsedPaper/structure.Node} node The node to calculate the research for.
	 *
	 * @returns {Promise<number>} The result of the research.
	 */
	calculateFor( node ) {
		const tokens = node.text.split( /\W+/ );
		return Promise.resolve( tokens.length );
	}

	/**
	 * Checks if the given node is a leaf node for this research.
	 *
	 * @param {module:parsedPaper/structure.Node} node The node to check.
	 *
	 * @returns {boolean} If the given node is considered a leaf node for this research.
	 */
	isLeafNode( node ) {
		// Only leaf nodes have text.
		return node instanceof LeafNode;
	}

	/**
	 * Merges results of this research according to a predefined strategy.
	 *
	 * @param {Array<*>} results The results of this research to merge.
	 *
	 * @returns {*} The merged results.
	 */
	mergeChildrenResults( results ) {
		// Total amount of tokens is just the sum.
		return sum( results );
	}
}

export default TestResearch;

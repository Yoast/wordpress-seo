import { flatten } from "lodash-es";

/* Internal dependencies */
import { Heading } from "../../structure";
import LeafNode from "../../structure/nodes/LeafNode";
import Research from "./Research";

/**
 * A research giving back the headings located in a text.
 */
class Headings extends Research {

	/**
	 * Calculates the result of the research for the given Node.
	 *
	 * @param {module:tree/structure.Node} node The node to do the research on.
	 *
	 * @returns {Promise<*>} The result of the research.
	 */
	calculateFor( node ) {
		return node instanceof Heading ? Promise.resolve( node ) : Promise.resolve( null );
	}

	/**
	 * Checks if the given node is a leaf node for this research.
	 *
	 * @param {module:tree/structure.Node} node The node to check.
	 *
	 * @returns {boolean} If the given node is considered a leaf node for this research.
	 */
	isLeafNode( node ) {
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
		return flatten( results ).filter( node => node );
	}
}

export default Headings;

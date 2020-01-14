import { flatten } from "lodash-es";

/* Internal dependencies */
import { Heading } from "../../structure/tree";
import Research from "./Research";

/**
 * A research giving back the headings located in a text.
 */
class Headings extends Research {
	/**
	 * Calculates the result of the research for the given Node.
	 *
	 * @param {module:parsedPaper/structure.Node} node The node to do the research on.
	 *
	 * @returns {Promise<module:parsedPaper/structure.Heading[]|[]>} The result of the research.
	 */
	calculateFor( node ) {
		return node instanceof Heading ? Promise.resolve( [ node ] ) : Promise.resolve( [] );
	}

	/**
	 * Merges results of this research according to a predefined strategy.
	 *
	 * @param {Array<module:parsedPaper/structure.Heading[]>} results The results of this research to merge.
	 *
	 * @returns {module:parsedPaper/structure.Heading[]} The merged results.
	 */
	mergeChildrenResults( results ) {
		return flatten( results );
	}
}

export default Headings;

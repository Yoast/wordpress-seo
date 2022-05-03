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
}

export default Headings;

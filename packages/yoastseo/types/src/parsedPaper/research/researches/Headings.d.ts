export default Headings;
/**
 * A research giving back the headings located in a text.
 */
declare class Headings extends Research {
    /**
     * Calculates the result of the research for the given Node.
     *
     * @param {module:parsedPaper/structure.Node} node The node to do the research on.
     *
     * @returns {Promise<module:parsedPaper/structure.Heading[]|[]>} The result of the research.
     */
    calculateFor(node: any): Promise<NodeModule>;
}
import Research from "./Research";

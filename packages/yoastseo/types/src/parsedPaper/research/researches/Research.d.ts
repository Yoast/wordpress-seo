export default Research;
/**
 * A research that can be applied to the tree.
 *
 * @memberOf module:parsedPaper/research
 *
 * @abstract
 */
declare class Research {
    /**
     * Checks if the given node is a leaf node for this research.
     *
     * @param {module:parsedPaper/structure.Node} node The node to check.
     *
     * @returns {boolean} If the given node is considered a leaf node for this research.
     *
     */
    isLeafNode(node: any): boolean;
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
    calculateFor(node: any, metadata: any): Promise<any>;
    /**
     * Merges results of this research according to a predefined strategy.
     *
     * @param {Array<*>} results The results of this research to merge.
     *
     * @returns {*} The merged results.
     */
    mergeChildrenResults(results: Array<any>): any;
}

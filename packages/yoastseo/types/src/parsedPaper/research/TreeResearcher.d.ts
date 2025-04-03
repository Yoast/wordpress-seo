export default TreeResearcher;
/**
 * This contains all possible, default researches
 * and logic to apply these researches to a formatted text,
 * represented as a tree structure.
 *
 * @memberOf module:parsedPaper/research
 */
declare class TreeResearcher {
    _researches: {};
    _data: {};
    /**
     * Adds or overwrites a research to the list of available researches.
     *
     * **Note**: When a research is already known under the given name,
     * the previous research with this name gets overwritten!
     *
     * @param {string} name       The ID to which to map the research to.
     * @param {Research} research The research to add.
     *
     * @returns {void}
     */
    addResearch(name: string, research: Research): void;
    /**
     * Returns all available researches.
     *
     * @returns {Object} An object containing all available researches.
     */
    getResearches(): Object;
    /**
     * Returns whether a research is known under this name.
     *
     * @param {string} name The name to get the research from.
     *
     * @returns {boolean} If a research is known under this name.
     */
    hasResearch(name: string): boolean;
    /**
     * Gets the research with the given name.
     * If a research is not known under this name, false is returned instead.
     *
     * @throws {Error} When a research is not known under the given name.
     *
     * @param {string} name The name of the research to get.
     *
     * @returns {Research} The research stored under the given name.
     */
    getResearch(name: string): Research;
    /**
     * Applies the research with the given name to the node and its descendants.
     *
     * @param {string} name The name of the research to apply to the node.
     * @param {module:parsedPaper/structure.Node} node The node to compute the research of.
     * @param {module:parsedPaper/structure.StructuredNode} metadata The node that holds the paper metadata.
     * @param {boolean} [bustCache=false] If we should force the results, as cached on each node, to be recomputed.
     *
     * @returns {Promise<*>} A promising research result.
     */
    doResearch(name: string, node: any, metadata: any, bustCache?: boolean | undefined): Promise<any>;
    /**
     * Add research data to the researcher by the research name.
     *
     * @param {string} researchName The identifier of the research.
     * @param {Object} data         The data object.
     *
     * @returns {void}.
     */
    addResearchData(researchName: string, data: Object): void;
    /**
     * Return the research data from a research data provider by research name.
     *
     * @param {string} researchName The identifier of the research.
     *
     * @returns {Object|boolean} The data provided by the provider, false if the data do not exist
     */
    getData(researchName: string): Object | boolean;
}

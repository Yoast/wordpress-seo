import { isEmpty, isUndefined } from "lodash-es";
import MissingArgument from "../../errors/missingArgument";

/**
 * This contains all possible, default researches
 * and logic to apply these researches to a formatted text,
 * represented as a tree structure.
 */
class TreeResearcher {
	/**
	 * Makes a new TreeResearcher.
	 *
	 * @param {module:tree/structure.Node?} rootNode The root node of the tree to analyze.
	 */
	constructor( rootNode ) {
		this.tree = rootNode || null;
		this.defaultResearches = {};
		this.customResearches = {};
		this.researches = this.defaultResearches;
	}

	/**
	 * Sets the tree for the researcher.
	 *
	 * @param {module:tree/structure.Node} rootNode The root node to add as a tree.
	 *
	 * @returns {void}
	 */
	setTree( rootNode ) {
		this.tree = rootNode;
	}

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
	addResearch( name, research ) {
		this.customResearches[ name ] = research;
		this.researches[ name ] = research;
	}

	/**
	 * If a research is know under this name.
	 *
	 * @param {string} name The name to get the research from.
	 * @returns {boolean} If a research is known under this name.
	 */
	hasResearch( name ) {
		return name in this.researches;
	}

	/**
	 * Gets the research with the given name.
	 * If a research is not known under this name, false is returned instead.
	 *
	 * @param {string} name The name of the research to get.
	 * @returns {Research|boolean} The returned research (or false if the research was not found).
	 */
	getResearchInstance( name ) {
		if ( isUndefined( name ) || isEmpty( name ) ) {
			throw new MissingArgument( "Research name cannot be empty" );
		}
		return this.hasResearch( name ) ? this.researches[ name ] : false;
	}

	/**
	 * Computes the research with the given name to the node and its descendants.
	 *
	 * @param {string} name                     The name of the research to apply to the node.
	 * @param {module:tree/structure.Node} node The node to compute the research of.
	 * @param {boolean} [bustCache=false]       If we should force the results, as cached on each node, to be recomputed.
	 *
	 * @returns {Promise<*>} A promising research result.
	 */
	async getResearchForNode( name, node, bustCache = false ) {
		const research = this.getResearchInstance( name );
		let researchResult = Promise.resolve();

		if ( research.isLeafNode( node ) ) {
			/*
			  Compute research results for this node, or use the cached results when available.
			  Always compute it when we need to bust the cache.
			 */
			if ( ! node.hasResearchResult( name ) || bustCache ) {
				node.setResearchResult( name, await research.calculateFor( node ) );
			}
			researchResult = node.getResearchResult( name );
		} else {
			const children = node.children;

			// Heading and paragraph nodes do not have children.
			if ( children ) {
				const resultsForChildren = await Promise.all( children.map( ( child ) => {
					return this.getResearchForNode( name, child );
				} ) );

				researchResult = research.mergeResults( resultsForChildren );
			}
		}

		return researchResult;
	}
}

export default TreeResearcher;

/**
 * An assessment that can be applied to a formatted text and its meta data.
 *
 * @memberOf module:tree/assess
 *
 * @abstract
 */
class Assessment {
	/**
	 * Creates a new assessment.
	 *
	 * @param {string} [name] An optional name.
	 *
	 * @abstract
	 */
	constructor( name ) {
		/**
		 * This assessment's unique name.
		 * @type {string}
		 */
		this.name = name;
	}

	/**
	 * Checks whether this assessment is applicable to the given paper and tree combination.
	 *
	 * @param {Paper} paper                     The paper to check.
	 * @param {module:tree/structure.Node} node The root node of the tree to check.
	 *
	 * @returns {Promise<boolean>} Whether this assessment is applicable to the given paper and tree combination (wrapped in a promise).
	 *
	 * @abstract
	 */
	async isApplicable( paper, node ) { // eslint-disable-line no-unused-vars
		console.warn( "`isApplicable` should be implemented by a child class of `Assessment`." );
	}

	/**
	 * Applies this assessment to the given combination of paper and tree.
	 *
	 * @param {Paper} paper                                    The paper to check.
	 * @param {module:tree/structure.Node} node                The root node of the tree to check.
	 * @param {module:tree/research.TreeResearcher} researcher The researcher to use to retrieve researches from.
	 *
	 * @returns {Promise<AssessmentResult>} The result of this assessment (wrapped in a promise).
	 *
	 * @abstract
	 */
	async apply( paper, node, researcher ) { // eslint-disable-line no-unused-vars
		console.warn( "`apply` should be implemented by a child class of `Assessment`." );
	}
}


export default Assessment;

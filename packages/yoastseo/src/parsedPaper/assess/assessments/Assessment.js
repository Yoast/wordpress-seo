/**
 * An assessment that can be applied to a formatted text and its meta data.
 *
 * @memberOf module:parsedPaper/assess
 *
 * @abstract
 */
class Assessment {
	/**
	 * Creates a new assessment.
	 *
	 * @param {string}                              name       The name to give this assessment.
	 * @param {module:parsedPaper/research.TreeResearcher} researcher The researcher to do researches with.
	 *
	 * @abstract
	 */
	constructor( name, researcher ) {
		/**
		 * This assessment's name.
		 * @type {string}
		 */
		this.name = name;
		/**
		 * The researcher to do researches with.
		 * @type {module:parsedPaper/research.TreeResearcher}
		 * @private
		 */
		this._researcher = researcher;
	}

	/**
	 * Sets a new researcher on this assessment.
	 *
	 * @param {module:parsedPaper/research.TreeResearcher} researcher The researcher to do researches with.
	 *
	 * @returns {void}
	 */
	setResearcher( researcher ) {
		this._researcher = researcher;
	}

	/**
	 * Returns the researcher used by this assessment.
	 *
	 * @returns {module:parsedPaper/research.TreeResearcher} The researcher used by this assessment.
	 */
	getResearcher() {
		return this._researcher;
	}

	/**
	 * Checks whether this assessment is applicable to the given paper and tree combination.
	 *
	 * @param {ParsedPaper} parsedPaper The parsedPaper to check.
	 *
	 * @returns {Promise<boolean>} Whether this assessment is applicable to the given paper and tree combination (wrapped in a promise).
	 *
	 * @abstract
	 */
	async isApplicable( parsedPaper ) { // eslint-disable-line no-unused-vars
		console.warn( "`isApplicable` should be implemented by a child class of `Assessment`." );
	}

	/**
	 * Applies this assessment to the given combination of parsedPaper and tree.
	 *
	 * @param {ParsedPaper} parsedPaper The parsedPaper to check.
	 *
	 * @returns {Promise<AssessmentResult>} The result of this assessment (wrapped in a promise).
	 *
	 * @abstract
	 */
	async apply( parsedPaper ) { // eslint-disable-line no-unused-vars
		console.warn( "`apply` should be implemented by a child class of `Assessment`." );
	}
}


export default Assessment;

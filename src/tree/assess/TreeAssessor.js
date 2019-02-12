/**
 * Analyzes a paper by doing a list of assessments on a tree representation of a text and its metadata.
 * Aggregates the scores on each individual assessment into an overall score.
 *
 * This score can represent anything from the readability to the SEO of the given text and metadata.
 *
 * @memberOf module:tree/assess
 */
class TreeAssessor {
	/**
	 * Creates a new assessor.
	 *
	 * @param {Object} options                                             Assessor options.
	 * @param {Jed} options.i18n                                           A Jed object to use for translations.
	 * @param {module:tree/research.TreeResearcher} options.researcher     Supplies the assessments with researches and their (cached) results.
	 * @param {module:tree/assess.ScoreAggregator} options.scoreAggregator Aggregates the scores on the individual assessments into one overall score.
	 * @param {module:tree/assess.Assessment[]} [options.assessments]      The list of assessments to apply.
	 */
	constructor( options ) {
		/**
		 * A Jed object to use for translations.
		 * @type {Jed}
		 */
		this.i18n = options.i18n;
		/**
		 * Supplies the assessments with researches and their (cached) results.
		 * @type {module:tree/research.TreeResearcher}
		 */
		this.researcher = options.researcher;
		/**
		 * Aggregates the scores on the individual assessments into one overall score.
		 * @type {module:tree/assess.ScoreAggregator}
		 */
		this.scoreAggregator = options.scoreAggregator;
		/**
		 * The list of assessments to apply.
		 * @type {module:tree/assess.Assessment[]|Array}
		 */
		this._assessments = options.assessments || [];
	}

	/**
	 * Returns the list of available assessments.
	 *
	 * @returns {module:tree/assess.Assessment[]} The list of all available assessments.
	 */
	getAvailableAssessments() {
		return this._assessments;
	}

	/**
	 * Assesses the given text by applying all the assessments to it
	 * and aggregating the resulting scores.
	 *
	 * @param {Paper} paper                     The paper to assess. This contains metadata about the text.
	 * @param {module:tree/structure.Node} node The text to check.
	 *
	 * @returns {Promise<number>} The overall assessment result.
	 */
	async assess( paper, node ) {
		const applicableAssessments = await this.getApplicableAssessments( paper, node );
		/*
		  Apply every applicable assessment on the document.
		  Wait before they are done before aggregating the results
		  and returning the final score.
		 */
		const results = await Promise.all(
			applicableAssessments.map( assessment => assessment.apply( paper, node, this.researcher ) )
		);
		return this.scoreAggregator.aggregate( results );
	}

	/**
	 * Adds the assessment to the list of assessments to apply.
	 *
	 * @param {string} name                              The name to register the assessment under.
	 * @param {module:tree/assess.Assessment} assessment The assessment to add.
	 *
	 * @returns {void}
	 */
	registerAssessment( name, assessment ) {
		assessment.name = name;
		this._assessments.push( assessment );
	}

	/**
	 * Removes the assessment registered under the given name, if it exists.
	 *
	 * @param {string} name The name of the assessment to remove.
	 *
	 * @returns {module:tree/assess.Assessment|null} The deleted assessment, or null if no assessment has been deleted.
	 */
	removeAssessment( name ) {
		const index = this._assessments.findIndex( assessment => assessment.name === name );
		if ( index > -1 ) {
			const deleted = this._assessments.splice( index, 1 );
			return deleted[ 0 ];
		}
		return null;
	}

	/**
	 * Returns the assessment registered under the given name.
	 * Returns `undefined` if no assessment is registered under the given name.
	 *
	 * @param {string} name The name of the assessment to get.
	 *
	 * @returns {Assessment|undefined} The assessment.
	 */
	getAssessment( name ) {
		return this._assessments.find( assessment => assessment.name === name );
	}

	/**
	 * Returns the list of applicable assessments.
	 *
	 * @param {Paper} paper                     The paper to check.
	 * @param {module:tree/structure.Node} node The tree to check.
	 *
	 * @returns {Promise<Array>} The list of applicable assessments.
	 */
	async getApplicableAssessments( paper, node ) {
		// List to store the applicable assessments in (empty for now).
		const applicableAssessments = [];

		// Asynchronously add each assessment to the list if they are applicable.
		const promises = this._assessments.map( assessment =>
			assessment.isApplicable( paper, node ).then(
				applicable => {
					if ( applicable ) {
						applicableAssessments.push( assessment );
					}
				}
			)
		);

		// Wait before all the applicable assessments have been added before returning them.
		return Promise.all( promises ).then( () => applicableAssessments );
	}
}

export default TreeAssessor;

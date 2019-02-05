/**
 * Analyzes a paper by doing a list of assessments on a tree representation of a text and its metadata.
 * Aggregates the scores on each individual assessment into an overall score.
 *
 * This score can represent anything from the readability to the SEO of the given text and metadata.
 */
class TreeAssessor {
	/**
	 * Creates a new assessor.
	 *
	 * @param {Object} options                                         Assessor options.
	 * @param {Jed} options.i18n                                       A Jed object to use for translations.
	 * @param {module:tree/research.TreeResearcher} options.researcher Supplies the assessments with researches and their (cached) results.
	 * @param {Object} options.scoreAggregator                         Aggregates the scores on the individual assessments into one overall score.
	 * @param {Object[]} [options.assessments]                         The list of assessments to do.
	 */
	constructor( options ) {
		this.i18n = options.i18n;
		this.researcher = options.researcher;
		this.scoreAggregator = options.scoreAggregator;
		this.assessments = options.assessments || [];
	}

	/**
	 * Returns the list of available assessments.
	 *
	 * @returns {Object[]|Array|*} The list of all available assessments.
	 */
	getAvailableAssessments() {
		return this.assessments;
	}

	/**
	 * Checks whether the given assessment is applicable to the given document.
	 *
	 * @param {Object} assessment    The assessment to check whether it is applicable.
	 * @param {Paper} document       The document to check.
	 *
	 * @returns {Promise<Boolean>} Whether the assessment is applicable (wrapped in a promise)
	 */
	async isApplicable( assessment, document ) {
		return assessment.isApplicable( document, this.researcher );
	}

	/**
	 * Assesses the given document by applying all the assessments to it
	 * and aggregating the resulting scores.
	 *
	 * @param {Object} document The document to assess.
	 *
	 * @returns {Promise<number>} The overall assessment score.
	 */
	async assess( document ) {
		/*
		  Do every assessment on the document.
		  Wait before they are done before aggregating the results.
		 */
		const results = await Promise.all(
			this.assessments.map( assessment => assessment.assess( document ) )
		);
		// Aggregate the results and return them.
		return this.scoreAggregator.aggregate( results );
	}

	/**
	 * Applies the given assessment to the given document.
	 *
	 * @param {Object} assessment The assessment to apply.
	 * @param {Object} document   The document to apply the assessment to.
	 *
	 * @returns {Promise<number>} The result of the assessment, wrapped in a promise.
	 */
	async applyAssessment( assessment, document ) {
		return assessment.assess( document );
	}
}

export default TreeAssessor;

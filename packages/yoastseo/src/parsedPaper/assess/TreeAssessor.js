import AssessmentResult from "../../values/AssessmentResult";

/**
 * Analyzes a paper by doing a list of assessments on a tree representation of a text and its metadata.
 * Aggregates the scores on each individual assessment into an overall score.
 *
 * This score can represent anything from the readability to the SEO of the given text and metadata.
 *
 * @memberOf module:parsedPaper/assess
 */
class TreeAssessor {
	/**
	 * Creates a new assessor.
	 *
	 * @param {Object}                                     options                 Assessor options.
	 * @param {Jed}                                        options.i18n            A Jed object to use for translations.
	 * @param {module:parsedPaper/research.TreeResearcher} options.researcher      Supplies the assessments with researches and their
	 *                                                                             (cached) results.
	 * @param {module:parsedPaper/assess.ScoreAggregator}  options.scoreAggregator Aggregates the scores on the individual assessments into one.
	 * @param {module:parsedPaper/assess.Assessment[]}     [options.assessments]   The list of assessments to apply.
	 */
	constructor( options ) {
		/**
		 * A Jed object to use for translations.
		 * @type {Jed}
		 */
		this.i18n = options.i18n;
		/**
		 * Supplies the assessments with researches and their (cached) results.
		 * @type {module:parsedPaper/research.TreeResearcher}
		 */
		this.researcher = options.researcher;
		/**
		 * Aggregates the scores on the individual assessments into one overall score.
		 * @type {module:parsedPaper/assess.ScoreAggregator}
		 */
		this.scoreAggregator = options.scoreAggregator;
		/**
		 * The list of assessments to apply.
		 * @type {module:parsedPaper/assess.Assessment[]}
		 */
		this._assessments = options.assessments || [];
		// Make sure that all of the assessments have the researcher.
		this._assessments.forEach( assessment => assessment.setResearcher( this.researcher ) );
	}

	/**
	 * Returns the list of available assessments.
	 *
	 * @returns {module:parsedPaper/assess.Assessment[]} The list of all available assessments.
	 */
	getAssessments() {
		return this._assessments;
	}

	/**
	 * Assesses the given text by applying all the assessments to it
	 * and aggregating the resulting scores.
	 *
	 * @param {Paper}                      paper The paper to assess. This contains metadata about the text.
	 * @param {module:parsedPaper/structure.Node} node  The root node of the tree to check.
	 *
	 * @returns {Promise<{results: AssessmentResult[], score: number}>} The assessment results and the overall score.
	 */
	async assess( paper, node ) {
		const applicableAssessments = await this.getApplicableAssessments( paper, node );
		/*
		  Apply every applicable assessment on the document.
		  Wait before they are done before aggregating the results
		  and returning the results and final score.
		 */
		const results = await Promise.all(
			applicableAssessments.map( assessment => this.applyAssessment( assessment, paper, node ) )
		);
		// Filter out errored assessments.
		const validResults = results.filter( result => result.getScore() !== -1 );
		// Compute overall score.
		const score = this.scoreAggregator.aggregate( validResults );

		return { results, score };
	}

	/**
	 * Applies the given assessment to the paper-node combination.
	 *
	 * @param {module:parsedPaper/assess.Assessment} assessment The assessment to apply.
	 * @param {Paper}                         paper      The paper to apply the assessment to.
	 * @param {module:parsedPaper/structure.Node}    node       The root node of the tree to apply the assessment to.
	 *
	 * @returns {Promise<AssessmentResult>} The result of the assessment.
	 */
	async applyAssessment( assessment, paper, node ) {
		return assessment.apply( paper, node ).catch(
			() => {
				return new AssessmentResult( {
					text: this.i18n.sprintf(
						/* Translators: %1$s expands to the name of the assessment. */
						this.i18n.dgettext( "js-text-analysis", "An error occurred in the '%1$s' assessment" ),
						assessment.name
					),
					score: -1,
				} );
			}
		);
	}

	/**
	 * Adds the assessment to the list of assessments to apply.
	 *
	 * @param {string}                        name       The name to register the assessment under.
	 * @param {module:parsedPaper/assess.Assessment} assessment The assessment to add.
	 *
	 * @returns {void}
	 */
	registerAssessment( name, assessment ) {
		assessment.name = name;
		assessment.setResearcher( this.researcher );
		this._assessments.push( assessment );
	}

	/**
	 * Removes the assessment registered under the given name, if it exists.
	 *
	 * @param {string} name The name of the assessment to remove.
	 *
	 * @returns {module:parsedPaper/assess.Assessment|null} The deleted assessment, or null if no assessment has been deleted.
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
	 * Returns `null` if no assessment is registered under the given name.
	 *
	 * @param {string} name The name of the assessment to get.
	 *
	 * @returns {Assessment|null} The assessment.
	 */
	getAssessment( name ) {
		const assessmentToReturn = this._assessments.find( assessment => assessment.name === name );
		return assessmentToReturn ? assessmentToReturn : null;
	}

	/**
	 * Sets the assessments that this assessor needs to apply.
	 *
	 * @param {module:parsedPaper/assess.Assessment[]} assessments The assessments to set.
	 *
	 * @returns {void}
	 */
	setAssessments( assessments ) {
		this._assessments = assessments;
	}

	/**
	 * Returns the list of applicable assessments.
	 *
	 * @param {Paper}                      paper The paper to check.
	 * @param {module:parsedPaper/structure.Node} node  The tree to check.
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

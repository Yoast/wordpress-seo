/**
 * Analyzes a paper by doing a list of assessments on a tree representation of a text.
 * Aggregates the scores on each individual assessment in to an overall score.
 */
class TreeAssessor {
	/**
	 * Creates a new assessor.
	 *
	 * @param {Object} options                                           Assessor options.
	 * @param {Jed} options.i18n                                         A Jed object to use for translations.
	 * @param {module:tree/researcher.TreeResearcher} options.researcher Supplies the assessments with researches and their (cached) results.
	 * @param {Object} options.scoreAggregator                           Aggregates the scores on the individual assessments to one overall score.
	 * @param {Object[]|null} options.assessments                        The list of assessments to do.
	 */
	constructor( options ) {
		this.i18n = options.i18n;
		this.researcher = options.researcher;
		this.scoreAggregator = options.scoreAggregator;
		this.assessments = options.assessments || [];
	}
}

export default TreeAssessor;

/**
 * Aggregates assessment results into a single score.
 *
 * @memberOf module:parsedPaper/assess
 *
 * @abstract
 */
class ScoreAggregator {
	/**
	 * Sets the locale of the content. We are more lenient on languages
	 * that are fully supported in the analysis.
	 *
	 * @param {string} locale The locale of the content.
	 *
	 * @returns {void}
	 */
	setLocale( locale ) {
		this.locale = locale;
	}

	/**
	 * Aggregates the given assessment results into a single score.
	 *
	 * @param {AssessmentResult[]} results The assessment results.
	 *
	 * @returns {number} The aggregated score.
	 *
	 * @abstract
	 */
	aggregate( results ) { // eslint-disable-line no-unused-vars
		console.warn( "'aggregate' must be implemented by a child class of 'ScoreAggregator'" );
	}
}

export default ScoreAggregator;

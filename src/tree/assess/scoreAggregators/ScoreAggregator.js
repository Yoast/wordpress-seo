/**
 * Aggregates assessment results into a single score.
 *
 * @memberOf module:tree/assess
 *
 * @abstract
 */
class ScoreAggregator {
	/**
	 * Aggregates the given assessment results into a single score.
	 *
	 * @param {AssessmentResult[]} results The assessment results.
	 *
	 * @returns {Number} The aggregated score.
	 *
	 * @abstract
	 */
	aggregate( results ) { // eslint-disable-line no-unused-vars
		console.warn( "'aggregate' must be implemented by a child class of 'ScoreAggregator'" );
	}
}

export default ScoreAggregator;

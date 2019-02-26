import { ScoreAggregator } from "../index";

/**
 * Aggregates the results of the readability analysis into a single score.
 */
class ReadabilityScoreAggregator extends ScoreAggregator {
	/**
	 * Aggregates the given assessment results into a single score.
	 *
	 * @param {AssessmentResult[]} results The assessment results.
	 *
	 * @returns {Number} The aggregated score.
	 */
	aggregate( results ) {
		return 0;
	}
}

export default ReadabilityScoreAggregator;

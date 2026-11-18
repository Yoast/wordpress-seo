import { ScoreAggregator } from "../../../src/scoring/scoreAggregators";

/**
 * Score aggregator to test the Assessor functionality.
 */
class TestAggregator extends ScoreAggregator {
	/**
	 * Aggregates the given assessment results into a single score.
	 *
	 * @param {AssessmentResult[]} results The assessment results.
	 *
	 * @returns {Number} The final countdown, eh I mean score.
	 */
	aggregate( results ) {
		return results.reduce( ( sum, result ) => sum + result.getScore(), 0 );
	}
}

export default TestAggregator;

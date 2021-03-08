import ScoreAggregator from "./ScoreAggregator";

/**
 * The number to scale the score to.
 *
 * Individual scores are from 1 to 9.
 * The total score should be multiplied by this number to scale up.
 *
 * @type {number}
 * @const
 *
 * @memberOf module:parsedPaper/assess
 */
const ScoreScale = 100;

/**
 * The factor to multiply the amount of results with.
 *
 * Individual scores are from 1 to 9.
 * The make the total score work in the 100 scale, the amount of results needs to get multiplied by this factor.
 *
 * @type {number}
 * @const
 *
 * @memberOf module:parsedPaper/assess
 */
const ScoreFactor = 9;

/**
 * Aggregates SEO assessment results into a single score.
 *
 * @memberOf module:parsedPaper/assess
 */
class SEOScoreAggregator extends ScoreAggregator {
	/**
	 * Aggregates the given assessment results into a single score.
	 *
	 * @param {AssessmentResult[]} results The assessment results.
	 *
	 * @returns {number} The aggregated score.
	 */
	aggregate( results ) {
		const score = results.reduce( ( sum, result ) => sum + result.getScore(), 0 );

		/*
		 * Whenever the divide by part is 0 this can result in a `NaN` value. Then 0 should be returned as fallback.
		 * This seemed better than the if check `results.length === 0`,
		 * because it also protects against ScoreFactor being 0.
		 */
		return Math.round( ( score * ScoreScale ) / ( results.length * ScoreFactor ) ) || 0;
	}
}

export default SEOScoreAggregator;

import SEOScoreAggregator from "./SEOScoreAggregator";

/**
 * Aggregates SEO assessment results into a single score.
 *
 * @memberOf module:parsedPaper/assess
 */
class RelatedKeywordScoreAggregator extends SEOScoreAggregator {
	/**
	 * Returns the list of valid results.
	 * Valid results are all results that have a score.
	 *
	 * @param {AssessmentResult[]} results The results to filter the valid results from.
	 *
	 * @returns {AssessmentResult[]} The list of valid results.
	 */
	getValidResults( results ) {
		return results.filter( result => result.hasScore() );
	}

	/**
	 * Aggregates the given assessment results into a single score.
	 *
	 * @param {AssessmentResult[]} results The assessment results.
	 *
	 * @returns {number} The aggregated score.
	 */
	aggregate( results ) {
		const validResults = this.getValidResults( results );

		return super.aggregate( validResults );
	}
}

export default RelatedKeywordScoreAggregator;

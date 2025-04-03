export default ValidOnlyResultsScoreAggregator;
/**
 * Aggregates SEO assessment results into a single score.
 * @extends SEOScoreAggregator
 */
declare class ValidOnlyResultsScoreAggregator extends SEOScoreAggregator {
    /**
     * Returns the list of valid results.
     * Valid results are all results that have a score.
     *
     * @param {AssessmentResult[]} results The results to filter the valid results from.
     *
     * @returns {AssessmentResult[]} The list of valid results.
     */
    getValidResults(results: AssessmentResult[]): AssessmentResult[];
}
import SEOScoreAggregator from "./SEOScoreAggregator";

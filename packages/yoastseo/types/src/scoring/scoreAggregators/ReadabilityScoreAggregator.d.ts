/**
 * The scores that can be given on the readability analysis.
 *
 * @type {{GOOD: number, OKAY: number, NEEDS_IMPROVEMENT: number, NOT_AVAILABLE: number}}
 * @const
 */
export const READABILITY_SCORES: {
    GOOD: number;
    OKAY: number;
    NEEDS_IMPROVEMENT: number;
    NOT_AVAILABLE: number;
};
export default ReadabilityScoreAggregator;
/**
 * Aggregates the results of the readability analysis into a single score.
 * @extends ScoreAggregator
 */
declare class ReadabilityScoreAggregator extends ScoreAggregator {
    /**
     * Determines whether a language is fully supported.
     *
     * @param {string} locale The locale for which the content is written, e.g. `sv-SE` for Sweden.
     *
     * @returns {boolean} `true` if fully supported.
     */
    isFullySupported(locale: string): boolean;
    /**
     * Calculates the overall score (GOOD, OKAY or NEEDS IMPROVEMENT)
     * based on the penalty.
     *
     * @param {boolean} isFullySupported Whether this language is fully supported.
     * @param {number}  penalty          The total penalty.
     *
     * @returns {number} The overall score.
     */
    calculateScore(isFullySupported: boolean, penalty: number): number;
    /**
     * Calculates the total penalty based on the given assessment results.
     *
     * @param {AssessmentResult[]} results The valid results from which to calculate the total penalty.
     *
     * @returns {number} The total penalty for the results.
     */
    calculatePenalty(results: AssessmentResult[]): number;
    /**
     * Returns the list of valid results.
     * Valid results are all results that have a score and a text.
     *
     * @param {AssessmentResult[]} results The results to filter the valid results from.
     *
     * @returns {AssessmentResult[]} The list of valid results.
     */
    getValidResults(results: AssessmentResult[]): AssessmentResult[];
}
import ScoreAggregator from "./ScoreAggregator";

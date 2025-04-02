export default ScoreAggregator;
/**
 * Aggregates assessment results into a single score.
 *
 * @abstract
 */
declare class ScoreAggregator {
    /**
     * Sets the locale of the content. We are more lenient on languages
     * that are fully supported in the readability analysis.
     *
     * @param {string} locale The locale of the content.
     *
     * @returns {void}
     */
    setLocale(locale: string): void;
    locale: string | undefined;
    /**
     * Aggregates the given assessment results into a single score.
     *
     * @param {AssessmentResult[]} results The assessment results.
     *
     * @returns {number} The aggregated score.
     *
     * @abstract
     */
    aggregate(results: AssessmentResult[]): number;
}

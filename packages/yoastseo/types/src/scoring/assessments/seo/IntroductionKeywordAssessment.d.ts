export default IntroductionKeywordAssessment;
/**
 * Assessment to check whether the keyphrase or synonyms are encountered in the first paragraph of the article.
 */
declare class IntroductionKeywordAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {Object} [config] The configuration to use.
     * @param {number} [config.scores.good] The score to return if there is a match within one sentence in the first paragraph.
     * @param {number} [config.scores.okay] The score to return if all words are matched in the first paragraph.
     * @param {number} [config.scores.bad] The score to return if not all words are matched in the first paragraph.
     * @param {string} [config.url] The URL to the relevant article on Yoast.com.
     *
     * @returns {void}
     */
    constructor(config?: Object | undefined);
    identifier: string;
    _config: {
        scores: {
            good: number;
            okay: number;
            bad: number;
        };
        urlTitle: string;
        urlCallToAction: string;
    } & Object;
    /**
     * Assesses the presence of keyphrase or synonyms in the first paragraph.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     *
     * @returns {AssessmentResult} The result of this assessment.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    _firstParagraphMatches: any;
    /**
     * Checks if the paper has both keyword and text.
     *
     * @param {Paper} paper The paper to be analyzed.
     *
     * @returns {boolean} Whether the assessment is applicable or not.
     */
    isApplicable(paper: Paper): boolean;
    /**
     * Returns a result based on the number of occurrences of keyphrase in the first paragraph.
     *
     * @returns {Object} result object with a score and translation text.
     */
    calculateResult(): Object;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

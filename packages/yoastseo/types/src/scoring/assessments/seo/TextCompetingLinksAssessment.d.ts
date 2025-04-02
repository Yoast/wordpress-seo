export default TextCompetingLinksAssessment;
/**
 * Assessment to check whether you're linking to a different page with the keyword from this page.
 */
declare class TextCompetingLinksAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {Object} [config] The configuration to use.
     * @param {number} [config.parameters.recommendedMaximum] The recommended maximum number of links using the same keyword as this paper.
     * @param {string} [config.scores.bad] The score to return if there are more links with the same keyword than the recommended maximum.
     * @param {string} [config.url] The URL to the relevant article on Yoast.com.
     *
     * @returns {void}
     */
    constructor(config?: Object | undefined);
    identifier: string;
    _config: {
        parameters: {
            recommendedMaximum: number;
        };
        scores: {
            bad: number;
        };
        urlTitle: string;
        urlCallToAction: string;
    } & Object;
    /**
     * Runs the linkCount module, based on this returns an assessment result with score.
     *
     * @param {Paper}       paper       The paper to use for the assessment.
     * @param {Researcher}  researcher  The researcher used for calling research.
     *
     * @returns {Object} The AssessmentResult.
     */
    getResult(paper: Paper, researcher: Researcher): Object;
    totalAnchorsWithKeyphrase: any;
    /**
     * Determines if the assessment is applicable to the paper.
     *
     * @param {Paper}       paper       The paper to check
     *
     * @returns {boolean} Whether the paper has text and a keyword
     */
    isApplicable(paper: Paper): boolean;
    /**
     * Returns a result based on the number of links.
     *
     * @returns {Object} ResultObject with score and text.
     */
    calculateResult(): Object;
}
import Assessment from "../assessment";

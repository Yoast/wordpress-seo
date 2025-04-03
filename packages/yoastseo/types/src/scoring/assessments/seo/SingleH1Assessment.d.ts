export default SingleH1Assessment;
/**
 * Assessment to check whether the body of the text contains more than 1 H1s in the body.
 * This assessment doesn't penalize H1 that is not in the very beginning of the body.
 */
declare class SingleH1Assessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {Object} config The configuration to use.
     *
     * @returns {void}
     */
    constructor(config?: Object);
    identifier: string;
    _config: {
        scores: {
            textContainsSuperfluousH1: number;
        };
        urlTitle: string;
        urlCallToAction: string;
    } & Object;
    /**
     * Runs the h1 research and based on this returns an assessment result with a score.
     *
     * @param {Paper}       paper       The paper to use for the assessment.
     * @param {Researcher}  researcher  The researcher used for calling the research.
     *
     * @returns {AssessmentResult} The assessment result.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    _h1s: any;
    /**
     * Returns the score and the feedback string for the single H1 assessment.
     *
     * @returns {Object|null} The calculated score and the feedback string.
     */
    calculateResult(): Object | null;
    /**
     * Marks all H1s in the body of the text, regardless of their position in the text.
     *
     * @returns {Array} Array with all the marked H1s.
     */
    getMarks(): any[];
    /**
     * Checks whether the paper has a text.
     *
     * @param {Paper}       paper       The paper to use for the assessment.
     *
     * @returns {boolean} True when there is text.
     */
    isApplicable(paper: Paper): boolean;
}
import Assessment from "../assessment.js";
import AssessmentResult from "../../../values/AssessmentResult.js";

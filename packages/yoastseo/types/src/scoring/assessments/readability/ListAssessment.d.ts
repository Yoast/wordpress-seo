/**
 * Represents the assessment that will look if the text has a list (only applicable for product pages).
 */
export default class ListAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     * @param {string} [config.urlTitle] The URL to the article about this assessment.
     * @param {string} [config.urlCallToAction] The URL to the help article for this assessment.
     * @param {object} [config.scores] The scores to use for the assessment.
     * @param {number} [config.scores.bad] The score to return if the text has no list.
     * @param {number} [config.scores.good] The score to return if the text has a list.
     * @param {object} [config.callbacks] The callbacks to use for the assessment.
     * @param {function} [config.callbacks.getResultTexts] The function that returns the result texts.
     *
     * @returns {void}
     */
    constructor(config?: {
        urlTitle?: string | undefined;
        urlCallToAction?: string | undefined;
        scores?: {
            bad?: number | undefined;
            good?: number | undefined;
        } | undefined;
        callbacks?: {
            getResultTexts?: Function | undefined;
        } | undefined;
    });
    _config: {
        urlTitle: string;
        urlCallToAction: string;
        scores: {
            bad: number;
            good: number;
        };
        callbacks: {};
    } & {
        urlTitle?: string | undefined;
        urlCallToAction?: string | undefined;
        scores?: {
            bad?: number | undefined;
            good?: number | undefined;
        } | undefined;
        callbacks?: {
            getResultTexts?: Function | undefined;
        } | undefined;
    };
    identifier: string;
    /**
     * Checks whether there is an ordered or unordered list in the paper.
     * @param {Paper}	paper	The paper to analyze.
     * @returns {boolean} Whether there is a list in the paper.
     */
    findList(paper: Paper): boolean;
    /**
     * Execute the Assessment and return a result.
     *
     * @param {Paper}       paper       The Paper object to assess.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */
    getResult(paper: Paper): AssessmentResult;
    textContainsList: boolean | undefined;
    /**
     * Checks whether the paper has text.
     *
     * @param {Paper}       paper       The paper to use for the assessment.
     *
     * @returns {boolean} True when there is text.
     */
    isApplicable(paper: Paper): boolean;
    /**
     * Calculate the result based on the availability of lists in the text.
     *
     * @returns {Object} The calculated result.
     */
    calculateResult(): Object;
    /**
     * Gets the feedback strings for the assessment.
     * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
     * The callback function should return an object with the following properties:
     * - good: string
     * - bad: string
     *
     * @returns {{good: string, bad: string}} The feedback strings.
     */
    getFeedbackStrings(): {
        good: string;
        bad: string;
    };
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

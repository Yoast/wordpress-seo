/**
 * Represents the assessment that checks whether a text has a title.
 */
export default class TextTitleAssessment extends Assessment {
    /**
     * Constructs a text title assessment.
     *
     * @param {object} config The config to use for the assessment.
     * @param {object} [config.scores] The scores to use for the assessment.
     * @param {number} [config.scores.good] The score to return if the text has a title.
     * @param {number} [config.scores.bad] The score to return if the text doesn't have a title.
     * @param {string} [config.urlTitle] The URL to the article about this assessment.
     * @param {string} [config.urlCallToAction] The URL to the help article for this assessment.
     * @param {object} [config.callbacks] The callbacks to use for the assessment.
     * @param {function} [config.callbacks.getResultTexts] The function that returns the result texts.
     *
     * @returns {void}
     */
    constructor(config?: {
        scores?: {
            good?: number | undefined;
            bad?: number | undefined;
        } | undefined;
        urlTitle?: string | undefined;
        urlCallToAction?: string | undefined;
        callbacks?: {
            getResultTexts?: Function | undefined;
        } | undefined;
    });
    identifier: string;
    _config: {
        scores: {
            good: number;
            bad: number;
        };
        urlTitle: string;
        urlCallToAction: string;
        callbacks: {};
    } & {
        scores?: {
            good?: number | undefined;
            bad?: number | undefined;
        } | undefined;
        urlTitle?: string | undefined;
        urlCallToAction?: string | undefined;
        callbacks?: {
            getResultTexts?: Function | undefined;
        } | undefined;
    };
    /**
     * Checks whether the paper has a text title.
     *
     * @param {Paper} 	paper		The paper to use for the assessment.
     *
     * @returns {boolean}	 Whether the paper has a text title.
     */
    getTextTitle(paper: Paper): boolean;
    /**
     * Gets the title from the Paper and based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     *
     * @returns {AssessmentResult} The assessment result.
     */
    getResult(paper: Paper): AssessmentResult;
    /**
     * Returns the result object based on whether the text has a title or not.
     *
     * @param {boolean} textTitleData Whether the text has a title.
     *
     * @returns {{resultText: string, score}} Result object with score and text.
     */
    calculateResult(textTitleData: boolean): {
        resultText: string;
        score: any;
    };
    /**
     * Gets the feedback strings for the text title assessment.
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

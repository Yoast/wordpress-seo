/**
 * Represents the assessment that checks whether there are too many complex words in the text.
 * This assessment is not bundled in Yoast SEO.
 */
export default class WordComplexityAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     * @param {number} [config.scores.acceptableAmount] The score to return if the text has an acceptable amount of complex words.
     * @param {number} [config.scores.goodAmount]       The score to return if the text has a good amount of complex words.
     * @param {string} [config.urlTitle]                The URL to the article about this assessment.
     * @param {string} [config.urlCallToAction]         The URL to the help article for this assessment.
     * @param {object} [config.callbacks] The callbacks to use for the assessment.
     * @param {function} [config.callbacks.getResultTexts]         The function that returns the result texts.
     *
     * @returns {void}
     */
    constructor(config?: object);
    identifier: string;
    _config: {
        scores: {
            acceptableAmount: number;
            goodAmount: number;
        };
        urlTitle: string;
        urlCallToAction: string;
        callbacks: {};
    } & object;
    /**
     * Scores the percentage of sentences including one or more transition words.
     *
     * @param {Paper} paper        The paper to use for the assessment.
     * @param {Researcher} researcher   The researcher used for calling research.
     *
     * @returns {object} The Assessment result.
     */
    getResult(paper: Paper, researcher: Researcher): object;
    _wordComplexity: any;
    /**
     * Calculates word complexity word result.
     *
     * @returns {object} Object containing the score, the result text and the information whether there is a mark.
     */
    calculateResult(): object;
    /**
     * Gets the feedback strings for the word complexity assessment.
     * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
     * The callback function should return an object with the following properties:
     * - acceptableAmount: string
     * - goodAmount: string
     *
     * @returns {{acceptableAmount: string, goodAmount: string}} The feedback strings.
     */
    getFeedbackStrings(): {
        acceptableAmount: string;
        goodAmount: string;
    };
    /**
     * Marks text for the word complexity assessment.
     *
     * @param {Paper}       paper       The paper to use for the marking.
     * @param {Researcher}  researcher  The researcher containing the necessary research.
     *
     * @returns {Array<Mark>} A list of marks that should be applied.
     */
    getMarks(paper: Paper, researcher: Researcher): Array<Mark>;
}
import Assessment from "../assessment";
import Mark from "../../../values/Mark";

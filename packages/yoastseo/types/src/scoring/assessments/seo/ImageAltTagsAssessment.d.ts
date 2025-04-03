/**
 * Represents the assessment that checks if all images have alt tags (only applicable for product pages).
 */
export default class ImageAltTagsAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {object}  config      The configuration to use.
     * @param {number}  [config.scores.bad]   The score to return if not all images have alt tags.
     * @param {number}  [config.scores.good]  The score to return if all images have alt tags.
     * @param {string}  [config.urlTitle]     The URL to the article about this assessment.
     * @param {string}  [config.urlCallToAction]  The URL to the help article for this assessment.
     * @param {object} [config.callbacks] The callbacks to use for the assessment.
     * @param {function}  [config.callbacks.getResultTexts]  The function that returns the result texts.
     *
     * @returns {void}
     */
    constructor(config?: object);
    identifier: string;
    _config: {
        scores: {
            bad: number;
            good: number;
        };
        urlTitle: string;
        urlCallToAction: string;
        callbacks: {};
    } & object;
    /**
     * Executes the Assessment and return a result.
     *
     * @param {Paper}       paper       The Paper object to assess.
     * @param {Researcher}  researcher  The Researcher object containing all available researches.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    altTagsProperties: any;
    imageCount: any;
    /**
     * Calculates the result based on the availability of images in the text.
     *
     * @returns {Object} The calculated result.
     */
    calculateResult(): Object;
    /**
     * Returns the feedback strings for the assessment.
     * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
     * This callback function should return an object with the following properties:
     * - good: string
     * - noneHasAltBad: string
     * - someHaveAltBad: string
     *
     * @returns {{good: string, noneHasAltBad: string, someHaveAltBad: string}} The feedback strings.
     */
    getFeedbackStrings(): {
        good: string;
        noneHasAltBad: string;
        someHaveAltBad: string;
    };
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

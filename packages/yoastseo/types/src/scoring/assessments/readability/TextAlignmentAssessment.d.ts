/**
 * Represents the assessment that checks whether there is an over-use of center-alignment in the text.
 */
export default class TextAlignmentAssessment extends Assessment {
    /**
     * Constructs a new TextAlignmentAssessment.
     *
     * @param {object} config The configuration to use.
     * @param {string} [config.urlTitle] The URL to the article about this assessment.
     * @param {string} [config.urlCallToAction] The URL to the help article for this assessment.
     * @param {object} [config.scores] The scores to use for the assessment.
     * @param {number} [config.scores.bad] The score to return if the text has an over-use of center-alignment.
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
        };
        callbacks: {};
    } & {
        urlTitle?: string | undefined;
        urlCallToAction?: string | undefined;
        scores?: {
            bad?: number | undefined;
        } | undefined;
        callbacks?: {
            getResultTexts?: Function | undefined;
        } | undefined;
    };
    identifier: string;
    /**
     * Executes the assessment and returns a result.
     *
     * @param {Paper}       paper       The Paper object to assess.
     * @param {Researcher}  researcher  The researcher used in the assessment.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    numberOfLongCenterAlignedTexts: any;
    /**
     * Creates the mark objects for all long center-aligned texts.
     *
     * @param {Paper}       paper        The paper to use for the assessment.
     * @param {Researcher}  researcher   The researcher used in the assessment.
     *
     * @returns {Mark[]} Mark objects for all long center-aligned texts.
     */
    getMarks(paper: Paper, researcher: Researcher): Mark[];
    /**
     * Calculates the result based on the number of center-aligned text found in the paper.
     *
     * @param {Paper}   paper                           The Paper object to assess.
     * @param {number}  numberOfLongCenterAlignedTexts  The number of paragraphs and/or headings
     * that are center aligned and longer than 50 characters.
     *
     * @returns {Object} The calculated result.
     */
    calculateResult(paper: Paper, numberOfLongCenterAlignedTexts: number): Object;
    /**
     * Returns the feedback strings for the assessment.
     * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
     * This callback function should return an object with the following properties:
     * - rightToLeft: string
     * - leftToRight: string
     * The singular strings are used when there is only one long center-aligned text, the plural strings are used when there are multiple.
     * rightToLeft is for the feedback string that is shown when the writing direction is right-to-left.
     * leftToRight is for the feedback string that is shown when the writing direction is left-to-right.
     *
     * @returns {{leftToRight: string, rightToLeft: string}} The feedback strings.
     */
    getFeedbackStrings(): {
        leftToRight: string;
        rightToLeft: string;
    };
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";

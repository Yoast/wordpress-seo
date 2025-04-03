export default KeyphraseDistributionAssessment;
/**
 * Represents an assessment that returns a score based on the largest percentage of text in which no keyword occurs.
 */
declare class KeyphraseDistributionAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {Object} [config] The configuration to use.
     * @param {number} [config.parameters.goodDistributionScore]
     *      The average distribution score that needs to be received from the step function to get a GOOD result.
     * @param {number} [config.parameters.acceptableDistributionScore]
     *      The average distribution score that needs to be received from the step function to get an OKAY result.
     * @param {number} [config.scores.good]             The score to return if keyword occurrences are evenly distributed.
     * @param {number} [config.scores.okay]             The score to return if keyword occurrences are somewhat unevenly distributed.
     * @param {number} [config.scores.bad]              The score to return if there is way too much text between keyword occurrences.
     * @param {number} [config.scores.consideration]    The score to return if there are no keyword occurrences.
     * @param {string} [config.urlTitle]                The URL to the article about this assessment.
     * @param {string} [config.urlCallToAction]         The URL to the help article for this assessment.
     * @param {object} [config.callbacks] 				The callbacks to use for the assessment.
     * @param {function} [config.callbacks.getResultTexts]	The function that returns the result texts.
     *
     * @returns {void}
     */
    constructor(config?: Object | undefined);
    identifier: string;
    _config: {
        parameters: {
            goodDistributionScore: number;
            acceptableDistributionScore: number;
        };
        scores: {
            good: number;
            okay: number;
            bad: number;
            consideration: number;
        };
        urlTitle: string;
        urlCallToAction: string;
        callbacks: {};
    } & Object;
    /**
     * Runs the keyphraseDistribution research and based on this returns an assessment result.
     *
     * @param {Paper}      paper      The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     *
     * @returns {AssessmentResult} The assessment result.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    _keyphraseDistribution: any;
    /**
     * Calculates the result based on the keyphraseDistribution research.
     *
     * @returns {Object} Object with score and feedback text.
     */
    calculateResult(): Object;
    /**
     * Gets the feedback strings for the keyphrase distribution assessment.
     * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
     * The callback function should return an object with the following properties:
     * - good: string
     * - okay: string
     * - bad: string
     * - consideration: string
     *
     * @returns {{good: string, okay: string, bad: string, consideration: string}} The feedback strings.
     */
    getFeedbackStrings(): {
        good: string;
        okay: string;
        bad: string;
        consideration: string;
    };
    /**
     * Creates a marker for all content words in keyphrase and synonyms.
     *
     * @returns {Array} All markers for the current text.
     */
    getMarks(): any[];
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

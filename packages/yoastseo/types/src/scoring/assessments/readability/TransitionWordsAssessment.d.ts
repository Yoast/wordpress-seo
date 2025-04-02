/**
 * Represents the assessment that checks whether there are enough transition words in the text.
 */
export default class TransitionWordsAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {object} config The configuration to use.
     *
     * @returns {void}
     */
    constructor(config?: object);
    identifier: string;
    _config: {
        urlTitle: string;
        urlCallToAction: string;
        applicableIfTextLongerThan: number;
    } & object;
    /**
     * Calculates the actual percentage of transition words in the sentences.
     *
     * @param {object} sentences The object containing the total number of sentences and the number of sentences containing
     * a transition word.
     *
     * @returns {number} The percentage of sentences containing a transition word.
     */
    calculateTransitionWordPercentage(sentences: object): number;
    /**
     * Calculates the score for the assessment based on the percentage of sentences containing transition words.
     *
     * @param {number} percentage The percentage of sentences containing transition words.
     *
     * @returns {number} The score.
     */
    calculateScoreFromPercentage(percentage: number): number;
    /**
     * Calculates transition word result.
     *
     * @param {object} transitionWordSentences  The object containing the total number of sentences and the number of sentences containing
     *                                          a transition word.
     *
     * @returns {object} Object containing score and text.
     */
    calculateTransitionWordResult(transitionWordSentences: object): object;
    /**
     * Scores the percentage of sentences including one or more transition words.
     *
     * @param {object} paper        The paper to use for the assessment.
     * @param {object} researcher   The researcher used for calling research.
     *
     * @returns {object} The Assessment result.
     */
    getResult(paper: object, researcher: object): object;
    /**
     * Marks text for the transition words assessment.
     *
     * @param {Paper}       paper       The paper to use for the marking.
     * @param {Researcher}  researcher  The researcher containing the necessary research.
     *
     * @returns {Array<Mark>} A list of marks that should be applied.
     */
    getMarks(paper: Paper, researcher: Researcher): Array<Mark>;
}
import Assessment from "../assessment";
import Mark from "../../../values/Mark.js";

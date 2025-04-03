export default SentenceLengthInTextAssessment;
/**
 * Represents the assessment that will calculate the length of sentences in the text.
 */
declare class SentenceLengthInTextAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {object} config			The scoring configuration that should be used.
     * @param {boolean} isCornerstone	Whether cornerstone configuration should be used.
     * @param {boolean} isProduct		Whether product configuration should be used.

     * @returns {void}
     */
    constructor(config?: object, isCornerstone?: boolean, isProduct?: boolean);
    _config: {
        recommendedLength: number;
        slightlyTooMany: number;
        farTooMany: number;
        urlTitle: string;
        urlCallToAction: string;
        countCharacters: boolean;
    } & object;
    _isCornerstone: boolean;
    _isProduct: boolean;
    identifier: string;
    /**
     * Scores the percentage of sentences including more than the recommended number of words.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     *
     * @returns {AssessmentResult} The Assessment result.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    /**
     * Checks whether the paper has text.
     *
     * @param {Paper} paper The paper to use for the assessment.
     *
     * @returns {boolean} True when there is text.
     */
    isApplicable(paper: Paper): boolean;
    /**
     * Mark the sentences.
     *
     * @param {Paper} paper The paper to use for the marking.
     * @param {Researcher} researcher The researcher to use.
     *
     * @returns {Array} Array with all the marked sentences.
     */
    getMarks(paper: Paper, researcher: Researcher): any[];
    /**
     * Check if there is language-specific config, and if so, overwrite the current config with it.
     *
     * @param {Researcher} researcher The researcher to use.
     *
     * @returns {Object} The config that should be used.
     */
    getLanguageSpecificConfig(researcher: Researcher): Object;
    /**
     * Translates the score to a message the user can understand.
     *
     * @param {number} score The score.
     * @param {number} percentage The percentage.
     *
     * @returns {string} A string.
     */
    translateScore(score: number, percentage: number): string;
    /**
     * Calculates the percentage of sentences that are too long.
     *
     * @param {SentenceLength[]} sentences The sentences to calculate the percentage for.
     * @returns {number} The calculates percentage of too long sentences.
     */
    calculatePercentage(sentences: SentenceLength[]): number;
    /**
     * Calculates the score for the given percentage.
     *
     * @param {number} percentage The percentage to calculate the score for.
     * @returns {number} The calculated score.
     */
    calculateScore(percentage: number): number;
    /**
     * Returns the sentences that are qualified as being too long.
     * @param {SentenceLength[]} sentences The sentences to filter.
     * @returns {SentenceLength[]} Array with all the sentences considered to be too long.
     */
    getTooLongSentences(sentences: SentenceLength[]): SentenceLength[];
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

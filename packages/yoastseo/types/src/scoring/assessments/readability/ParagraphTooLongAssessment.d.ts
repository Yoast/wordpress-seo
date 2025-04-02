/**
 * Represents the assessment that will look if the Paper contains paragraphs that are considered too long.
 */
export default class ParagraphTooLongAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     * @constructor
     * @param {object} config       The configuration to use.
     * @param {boolean} isProduct   Whether product configuration should be used.
     */
    constructor(config?: object, isProduct?: boolean);
    identifier: string;
    _config: {
        urlTitle: string;
        urlCallToAction: string;
        countCharacters: boolean;
        parameters: {
            recommendedLength: number;
            maximumRecommendedLength: number;
        };
    } & object;
    _isProduct: boolean;
    /**
     * Returns an array containing only the paragraphs longer than the recommended length.
     *
     * @param {ParagraphLength[]} paragraphsLength The array containing the lengths of individual paragraphs.
     * @param {object} config The config to use.
     *
     * @returns {ParagraphLength[]} An array containing too long paragraphs.
     */
    getTooLongParagraphs(paragraphsLength: ParagraphLength[], config: object): ParagraphLength[];
    /**
     * Check if there is language-specific config, and if so, overwrite the current config with it.
     *
     * @param {Researcher} researcher The researcher to use.
     *
     * @returns {Object} The config that should be used.
     */
    getConfig(researcher: Researcher): Object;
    /**
     * Returns the score for the ParagraphTooLongAssessment.
     * @param {ParagraphLength[]} paragraphsLength The array containing the lengths of individual paragraphs.
     * @param {object} config The config to use.
     * @returns {number} The score.
     */
    getScore(paragraphsLength: ParagraphLength[], config: object): number;
    /**
     * Returns the scores and text for the ParagraphTooLongAssessment.
     *
     * @param {ParagraphLength[]} paragraphsLength The array containing the lengths of individual paragraphs.
     * @param {object} config The config to use.
     *
     * @returns {AssessmentResult} The assessmentResult.
     */
    calculateResult(paragraphsLength: ParagraphLength[], config: object): AssessmentResult;
    /**
     * Sort the paragraphs based on word count.
     *
     * @param {Array} paragraphs The array with paragraphs.
     *
     * @returns {Array} The array sorted on word counts.
     */
    sortParagraphs(paragraphs: any[]): any[];
    /**
     * Creates a marker for the paragraphs.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     *
     * @returns {Mark[]} An array with marked paragraphs.
     */
    getMarks(paper: Paper, researcher: Researcher): Mark[];
    /**
     * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
     *
     * @param {Paper} paper             The paper to use for the assessment.
     * @param {Researcher} researcher   The researcher used for calling research.
     *
     * @returns {AssessmentResult} The assessment result.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    /**
     * Checks if the paragraphTooLong assessment is applicable to the paper.
     *
     * @param {Paper} paper The paper to check.
     *
     * @returns {boolean} Returns true if the assessment is applicable to the paper.
     */
    isApplicable(paper: Paper): boolean;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";

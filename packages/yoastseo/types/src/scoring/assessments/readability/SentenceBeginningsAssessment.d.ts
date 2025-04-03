/**
 * Represents the assessment that checks whether there are three or more consecutive sentences beginning with the same word.
 */
export default class SentenceBeginningsAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     * @param {{urlTitle?: string, urlCallToAction?: string}} config The configuration to use.
     */
    constructor(config?: {
        urlTitle?: string;
        urlCallToAction?: string;
    });
    identifier: string;
    _config: {
        urlTitle: string;
        urlCallToAction: string;
    } & {
        urlTitle?: string;
        urlCallToAction?: string;
    };
    /**
     * Counts and groups the number too often used sentence beginnings and determines the lowest count within that group.
     *
     * @param {SentenceBeginning[]} sentenceBeginnings The array containing the objects containing the beginning words and counts.
     *
     * @returns {{total: number, lowestCount: number}} The object containing the total number of too often used beginnings and the lowest count within those.
     */
    groupSentenceBeginnings(sentenceBeginnings: SentenceBeginning[]): {
        total: number;
        lowestCount: number;
    };
    /**
     * Calculates the score based on sentence beginnings.
     *
     * @param {{total: number, lowestCount: number}} groupedSentenceBeginnings    The object with grouped sentence beginnings.
     *
     * @returns {AssessmentResult} AssessmentResult object with score and feedback.
     */
    calculateSentenceBeginningsResult(groupedSentenceBeginnings: {
        total: number;
        lowestCount: number;
    }): AssessmentResult;
    /**
     * Marks all consecutive sentences with the same beginnings.
     *
     * @param {Paper} paper             The paper to use for the assessment.
     * @param {Researcher} researcher   The researcher used for calling research.
     *
     * @returns {Mark[]} All marked sentences.
     */
    getMarks(paper: Paper, researcher: Researcher): Mark[];
    /**
     * Scores the repetition of sentence beginnings in consecutive sentences.
     *
     * @param {Paper} paper           The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     *
     * @returns {AssessmentResult} The result of the assessment.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    /**
     * Checks whether the sentence beginnings assessment is applicable.
     *
     * @param {Paper}       paper       The paper to check.
     * @param {Researcher}  researcher  The researcher object.
     *
     * @returns {boolean} Returns true if the paper has enough content for the assessment and the researcher has the required research.
     */
    isApplicable(paper: Paper, researcher: Researcher): boolean;
}
export type Researcher = import("../../../languageProcessing/AbstractResearcher").default;
export type SentenceBeginning = import("../../../languageProcessing/researches/getSentenceBeginnings").SentenceBeginning;
export type Paper = import("../../../values/").Paper;
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import Mark from "../../../values/Mark";

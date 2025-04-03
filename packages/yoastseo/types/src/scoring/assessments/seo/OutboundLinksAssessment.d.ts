/**
 * Assessment for calculating the outbound links in the text.
 */
export default class OutboundLinksAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {Object} [config] The configuration to use.
     *
     * @returns {void}
     */
    constructor(config?: Object | undefined);
    identifier: string;
    _config: {
        scores: {
            noLinks: number;
            allNofollowed: number;
            someNoFollowed: number;
            allFollowed: number;
        };
        urlTitle: string;
        urlCallToAction: string;
    } & Object;
    /**
     * Runs the getLinkStatistics module, based on this returns an assessment result with score.
     *
     * @param {Paper}       paper       The paper to use for the assessment.
     * @param {Researcher}  researcher  The researcher used for calling research.
     *
     * @returns {AssessmentResult} The assessment result.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    /**
     * Checks whether paper has text.
     *
     * @param {Paper}       paper       The paper to use for the assessment.
     *
     * @returns {boolean} True when there is text.
     */
    isApplicable(paper: Paper): boolean;
    /**
     * Returns a score based on the linkStatistics object.
     *
     * @param {object} linkStatistics The object with all link statistics.
     *
     * @returns {number|null} The calculated score.
     */
    calculateScore(linkStatistics: object): number | null;
    /**
     * Translates the score to a message the user can understand.
     *
     * @param {Object}  linkStatistics  The object with all link statistics.
     *
     * @returns {string} The translated string.
     */
    translateScore(linkStatistics: Object): string;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

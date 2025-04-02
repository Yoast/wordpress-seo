/**
 * Represents the assessment that assesses the SEO title width and gives the feedback accordingly.
 */
export default class PageTitleWidthAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {Object}  [config]        The configuration to use.
     * @param {boolean} allowShortTitle Whether the short title width is penalized with a bad score or not.
     *
     * @returns {void}
     */
    constructor(config?: Object | undefined, allowShortTitle?: boolean);
    _allowShortTitle: boolean;
    identifier: string;
    _config: {
        minLength: number;
        maxLength: number;
        scores: {
            noTitle: number;
            widthTooShort: number;
            widthTooLong: number;
            widthCorrect: number;
        };
        urlTitle: string;
        urlCallToAction: string;
    } & Object;
    /**
     * Returns the maximum length.
     *
     * @returns {number} The maximum length.
     */
    getMaximumLength(): number;
    /**
     * Runs the pageTitleWidth module, based on this returns an assessment result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     *
     * @returns {AssessmentResult} The assessment result.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    /**
     * Returns the score for the SEO title width calculation.
     *
     * @param {number} pageTitleWidth The width of the SEO title.
     *
     * @returns {number} The calculated score.
     */
    calculateScore(pageTitleWidth: number): number;
    /**
     * Translates the score of the SEO title width calculation to a message the user can understand.
     *
     * @param {number} pageTitleWidth The width of the SEO title.
     *
     * @returns {string} The translated string.
     */
    translateScore(pageTitleWidth: number): string;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

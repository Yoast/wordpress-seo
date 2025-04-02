/**
 * Assessment for calculating the length of the meta description.
 */
export default class MetaDescriptionLengthAssessment extends Assessment {
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
        recommendedMaximumLength: number;
        maximumLength: number;
        scores: {
            noMetaDescription: number;
            tooLong: number;
            tooShort: number;
            correctLength: number;
        };
        urlTitle: string;
        urlCallToAction: string;
    } & Object;
    /**
     * Returns the maximum length.
     *
     * @param {string}  locale  The locale.
     *
     * @returns {number} The maximum length.
     */
    getMaximumLength(locale: string): number;
    /**
     * Checks if language specific config is available, and overwrite the default config if it is.
     *
     * This method of returning the configuration by checking the locale is necessary since this assessment is also
     * initialized for calculations outside content analysis where we don't have access to the Researcher.
     *
     * @param {string}  locale  The locale.
     *
     * @returns {object}    The configuration to use.
     */
    getConfig(locale: string): object;
    /**
     * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
     *
     * @param {Paper}       paper       The paper to use for the assessment.
     * @param {Researcher}  researcher  The researcher used for calling research.
     *
     * @returns {AssessmentResult} The assessment result.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    /**
     * Returns the score for the descriptionLength.
     *
     * @param {number}  descriptionLength The length of the meta description.
     * @param {string}  locale            The locale.
     *
     * @returns {number} The calculated score.
     */
    calculateScore(descriptionLength: number, locale: string): number;
    /**
     * Translates the descriptionLength to a message the user can understand.
     *
     * @param {number}  descriptionLength   The length of the meta description.
     * @param {object}  config              The configuration to use.
     *
     * @returns {string} The translated string.
     */
    translateScore(descriptionLength: number, config: object): string;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

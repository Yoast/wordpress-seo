/**
 * Represents the assessment that checks if the text has any images present, including videos in product pages.
 */
export default class TextImagesAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {object}  config      The configuration to use.
     * @param {boolean} countVideos Whether videos are also included in the assessment or not.
     *
     * @returns {void}
     */
    constructor(config?: object, countVideos?: boolean);
    identifier: string;
    _config: {
        scores: {
            bad: number;
            good: number;
        };
        recommendedCount: number;
        urlTitle: string;
        urlCallToAction: string;
    } & object;
    _countVideos: boolean;
    /**
     * Execute the Assessment and return a result.
     *
     * @param {Paper}       paper       The Paper object to assess.
     * @param {Researcher}  researcher  The Researcher object containing all available researches.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    imageCount: any;
    videoCount: any;
    /**
     * Checks whether the paper has text.
     *
     * @param {Paper}       paper       The paper to use for the assessment.
     *
     * @returns {boolean} True when there is text.
     */
    isApplicable(paper: Paper): boolean;
    /**
     * Calculate the result based on the availability of images in the text, including videos in product pages.
     *
     * @returns {Object} The calculated result.
     */
    calculateResult(): Object;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

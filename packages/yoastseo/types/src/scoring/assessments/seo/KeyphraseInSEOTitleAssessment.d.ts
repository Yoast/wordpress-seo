export default KeyphraseInSEOTitleAssessment;
/**
 * Assessment to check whether the keyphrase is included in (the beginning of) the SEO title.
 */
declare class KeyphraseInSEOTitleAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {Object} [config] The configuration to use.
     * @param {number} [config.parameters.recommendedPosition] The recommended position of the keyphrase within the SEO title.
     * @param {number} [config.scores.good] The score to return if the keyphrase is found at the recommended position.
     * @param {number} [config.scores.okay] The score to return if the keyphrase is found, but not at the recommended position.
     * @param {number} [config.scores.bad] The score to return if there are fewer keyphrase occurrences than the recommended minimum.
     * @param {string} [config.url] The URL to the relevant article on Yoast.com.
     *
     * @returns {void}
     */
    constructor(config?: Object | undefined);
    identifier: string;
    name: string;
    _config: {
        parameters: {
            recommendedPosition: number;
        };
        scores: {
            good: number;
            okay: number;
            bad: number;
        };
        urlTitle: string;
        urlCallToAction: string;
        feedbackStrings: {
            bad: string;
        };
    } & Object;
    /**
     * Executes the SEO title keyphrase assessment and returns an assessment result.
     *
     * @param {Paper}       paper       The Paper object to assess.
     * @param {Researcher}  researcher  The Researcher object containing all available researches.
     *
     * @returns {AssessmentResult} The result of the assessment with text and score.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    _keyphraseMatches: any;
    _keyphrase: string | undefined;
    /**
     * Checks whether the assessment is applicable to the paper
     *
     * @param {Paper} paper The Paper object to assess.
     *
     * @returns {boolean} Whether the paper has a keyphrase and an SEO title.
     */
    isApplicable(paper: Paper): boolean;
    /**
     * Calculates the result based on whether and how the keyphrase was matched in the SEO title. Returns GOOD result if
     * an exact match of the keyphrase is found in the beginning of the SEO title. Returns OK results if all content words
     * from the keyphrase are in the SEO title (in any form). Returns BAD otherwise.
     *
     * @param {string}  keyphrase   The keyphrase of the paper (to be returned in the feedback strings).
     * @param {string}  language    The language to check.
     *
     * @returns {Object} Object with score and text.
     */
    calculateResult(keyphrase: string, language: string): Object;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

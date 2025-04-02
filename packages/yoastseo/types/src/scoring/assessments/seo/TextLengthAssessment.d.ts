/**
 * Represents an assessment that checks the length of the text and gives feedback accordingly.
 */
export default class TextLengthAssessment extends Assessment {
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
        recommendedMinimum: number;
        slightlyBelowMinimum: number;
        belowMinimum: number;
        veryFarBelowMinimum: number;
        scores: {
            recommendedMinimum: number;
            slightlyBelowMinimum: number;
            belowMinimum: number;
            farBelowMinimum: number;
            veryFarBelowMinimum: number;
        };
        countTextIn: {
            singular: string;
            plural: string;
        };
        urlTitle: string;
        urlCallToAction: string;
        cornerstoneContent: boolean;
        customContentType: string;
    } & Object;
    /**
     * Executes the Assessment and returns a result.
     *
     * @param {Paper}       paper       The Paper object to assess.
     * @param {Researcher}  researcher  The Researcher object containing all available researches.
     *
     * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    /**
     * Checks if there is language-specific config, and if so, overwrites the current config with it.
     *
     * @param {Researcher} researcher The researcher to use.
     *
     * @returns {Object} The config that should be used.
     */
    getLanguageSpecificConfig(researcher: Researcher): Object;
    /**
     * Returns the score and the appropriate feedback string based on the current word count
     * for taxonomies (in WordPress) and collections (in Shopify).
     *
     * @param {number} wordCount	The amount of words to be checked against.
     * @returns {Object} The score and the feedback string.
     */
    calculateTaxonomyResult(wordCount: number): Object;
    /**
     * Returns the score and the appropriate feedback string based on the current word count for every type of content.
     *
     * @param {number}  wordCount   The amount of words to be checked against.
     *
     * @returns {Object} The score and the feedback string.
     */
    calculateResult(wordCount: number): Object;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

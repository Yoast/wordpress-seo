export default KeyphraseDensityAssessment;
/**
 * Represents the assessment that will look if the keyphrase density is within the recommended range.
 */
export class KeyphraseDensityAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {Object} [config] The configuration to use.
     *
     * If word forms are not available:
     * @param {number} [config.parameters.noWordForms.overMaximum] The percentage of keyphrase instances in the text that
     * is way over the maximum.
     * @param {number} [config.parameters.noWordForms.maximum] The maximum percentage of keyphrase instances in the text.
     * @param {number} [config.parameters.noWordForms.minimum] The minimum percentage of keyphrase instances in the text.
     *
     * If word forms are available:
     * @param {number} [config.parameters.multipleWordForms.overMaximum] The percentage of keyphrase instances in the text that
     * is way over the maximum.
     * @param {number} [config.parameters.multipleWordForms.maximum] The maximum percentage of keyphrase instances in the text.
     * @param {number} [config.parameters.multipleWordForms.minimum] The minimum percentage of keyphrase instances in the text.
     *
     * @param {number} [config.scores.wayOverMaximum] The score to return if there are way too many instances of keyphrase in the text.
     * @param {number} [config.scores.overMaximum] The score to return if there are too many instances of keyphrase in the text.
     * @param {number} [config.scores.correctDensity] The score to return if there is a good number of keyphrase instances in the text.
     * @param {number} [config.scores.underMinimum] The score to return if there is not enough keyphrase instances in the text.
     *
     * @param {string} [config.url] The URL to the relevant KB article.
     *
     * @returns {void}
     */
    constructor(config?: Object | undefined);
    identifier: string;
    _config: {
        parameters: {
            noWordForms: {
                overMaximum: number;
                maximum: number;
                minimum: number;
            };
            multipleWordForms: {
                overMaximum: number;
                maximum: number;
                minimum: number;
            };
        };
        scores: {
            wayOverMaximum: number;
            overMaximum: number;
            correctDensity: number;
            underMinimum: number;
        };
        urlTitle: string;
        urlCallToAction: string;
        applicableIfTextLongerThan: number;
    } & Object;
    /**
     * Determines correct boundaries depending on the availability of morphological forms.
     *
     * @param {Paper} paper The paper to analyze.
     * @param {number} keyphraseLength The length of the keyphrase in words.
     * @param {function} customGetWords A helper to get words from the text for languages that don't use the default approach.
     *
     * @returns {void}
     */
    setBoundaries(paper: Paper, keyphraseLength: number, customGetWords: Function): void;
    _boundaries: {
        overMaximum: number;
        maximum: number;
        minimum: number;
    } | {
        overMaximum: number;
        maximum: number;
        minimum: number;
    } | undefined;
    _minRecommendedKeyphraseCount: number | undefined;
    _maxRecommendedKeyphraseCount: number | undefined;
    /**
     * Runs the keyphrase density module, based on this returns an assessment
     * result with score.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling the research.
     *
     * @returns {AssessmentResult} The result of the assessment.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    _keyphraseCount: any;
    _keyphraseDensity: any;
    _hasMorphologicalForms: boolean | undefined;
    /**
     * Checks whether there are no keyphrase matches in the text.
     *
     * @returns {boolean} Returns true if the keyphrase count is 0.
     */
    hasNoMatches(): boolean;
    /**
     * Checks whether there are too few keyphrase matches in the text.
     *
     * @returns {boolean} Returns true if the rounded keyphrase density is between 0 and the recommended minimum
     * or if there is only 1 keyphrase match (regardless of the density).
     */
    hasTooFewMatches(): boolean;
    /**
     * Checks whether there is a good number of keyphrase matches in the text.
     *
     * @returns {boolean} Returns true if the rounded keyphrase density is between the recommended minimum
     * and the recommended maximum or if the keyphrase count is 2 and the recommended minimum is lower than 2.
     */
    hasGoodNumberOfMatches(): boolean;
    /**
     * Checks whether the number of keyphrase matches in the text is between the
     * recommended maximum and the specified overMaximum value.
     *
     * @returns {boolean} Returns true if the rounded keyphrase density is between
     *                    the recommended maximum and the specified overMaximum
     *                    value.
     */
    hasTooManyMatches(): boolean;
    /**
     * Returns the score for the keyphrase density.
     *
     * @returns {Object} The object with calculated score and resultText.
     */
    calculateResult(): Object;
    /**
     * Marks the occurrences of keyphrase in the text for the keyphrase density assessment.
     *
     * @returns {Array<Mark>} Marks that should be applied.
     */
    getMarks(): Array<Mark>;
}
/**
 * This assessment checks if the keyphrase density is within the recommended range.
 * KeywordDensityAssessment was the previous name for KeyphraseDensityAssessment (hence the name of this file).
 * We keep (and expose) this assessment for backwards compatibility.
 *
 * @deprecated Use KeyphraseDensityAssessment instead.
 */
export class KeywordDensityAssessment extends KeyphraseDensityAssessment {
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

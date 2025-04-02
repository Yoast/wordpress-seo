export default KeyphraseLengthAssessment;
/**
 * Assessment to check whether the keyphrase has a good length.
 */
declare class KeyphraseLengthAssessment extends Assessment {
    /**
     * Sets the identifier and the config.
     *
     * @param {Object} [config] The configuration to use.
     * @param {boolean} isProductPage Whether product page scoring is used or not.
     * @param {number} [config.parameters.recommendedMinimum] The recommended minimum length of the keyphrase (in words).
     * @param {number} [config.parameters.acceptableMaximum] The acceptable maximum length of the keyphrase (in words).
     * @param {number} [config.scores.veryBad] The score to return if the length of the keyphrase is below recommended minimum.
     * @param {number} [config.scores.consideration] The score to return if the length of the keyphrase is above acceptable maximum.
     *
     * @returns {void}
     */
    constructor(config?: Object | undefined, isProductPage?: boolean);
    defaultConfig: {
        parameters: {
            recommendedMinimum: number;
            recommendedMaximum: number;
            acceptableMaximum: number;
        };
        parametersNoFunctionWordSupport: {
            recommendedMaximum: number;
            acceptableMaximum: number;
        };
        scores: {
            veryBad: number;
            bad: number;
            okay: number;
            good: number;
        };
        countTextIn: {
            singular: string;
            plural: string;
        };
        urlTitle: string;
        urlCallToAction: string;
        isRelatedKeyphrase: boolean;
    };
    identifier: string;
    _config: {
        parameters: {
            recommendedMinimum: number;
            recommendedMaximum: number;
            acceptableMaximum: number;
        };
        parametersNoFunctionWordSupport: {
            recommendedMaximum: number;
            acceptableMaximum: number;
        };
        scores: {
            veryBad: number;
            bad: number;
            okay: number;
            good: number;
        };
        countTextIn: {
            singular: string;
            plural: string;
        };
        urlTitle: string;
        urlCallToAction: string;
        isRelatedKeyphrase: boolean;
    } & Object;
    _isProductPage: boolean;
    /**
     * Assesses the keyphrase presence and length.
     *
     * @param {Paper} paper The paper to use for the assessment.
     * @param {Researcher} researcher The researcher used for calling research.
     *
     * @returns {AssessmentResult} The result of this assessment.
     */
    getResult(paper: Paper, researcher: Researcher): AssessmentResult;
    _keyphraseLengthData: any;
    _boundaries: {
        recommendedMinimum: number;
        recommendedMaximum: number;
        acceptableMaximum: number;
    } | undefined;
    /**
     * Merges language-specific configurations for product/regular pages.
     *
     * @param {Researcher} researcher The researcher used for calling research.
     *
     * @returns {Object} Configuration to use.
     */
    getCustomConfig(researcher: Researcher): Object;
    /**
     * Calculates the result for product pages based on the keyphraseLength research.
     *
     * @returns {Object} Object with score and text.
     */
    calculateResultForProduct(): Object;
    /**
     * Calculates the result based on the keyphraseLength research.
     *
     * @returns {Object} Object with score and text.
     */
    calculateResult(): Object;
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

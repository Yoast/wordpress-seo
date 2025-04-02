/**
 * Represents the assessment that checks whether a product has identifier(s).
 */
export default class ProductIdentifiersAssessment extends Assessment {
    /**
     * Constructs a product identifier assessment.
     *
     * @param {Object} config   Potential additional config for the assessment.
     * @param {Object} [config.scores] The scores to use for the assessment.
     * @param {number} [config.scores.good] The score to return if the product has an identifier.
     * @param {number} [config.scores.ok] The score to return if the product doesn't have an identifier.
     * @param {string} [config.urlTitle] The URL to the article about this assessment.
     * @param {string} [config.urlCallToAction] The URL to the help article for this assessment.
     * @param {boolean} [config.assessVariants] Whether to assess variants.
     * @param {boolean} [config.shouldShowEditButton] Whether to show edit button.
     * @param {string} [config.editFieldName] The name of the field to edit.
     * @param {function} [config.callbacks] The callbacks to use for the assessment.
     * @param {function} [config.callbacks.getResultTexts] The function that returns the result texts.
     *
     * @returns {void}
     */
    constructor(config?: {
        scores?: {
            good?: number | undefined;
            ok?: number | undefined;
        } | undefined;
        urlTitle?: string | undefined;
        urlCallToAction?: string | undefined;
        assessVariants?: boolean | undefined;
        shouldShowEditButton?: boolean | undefined;
        editFieldName?: string | undefined;
        callbacks?: Function | undefined;
    });
    identifier: string;
    _config: {
        scores: {
            good: number;
            ok: number;
        };
        urlTitle: string;
        urlCallToAction: string;
        assessVariants: boolean;
        shouldShowEditButton: boolean;
        editFieldName: string;
        callbacks: {};
    } & {
        scores?: {
            good?: number | undefined;
            ok?: number | undefined;
        } | undefined;
        urlTitle?: string | undefined;
        urlCallToAction?: string | undefined;
        assessVariants?: boolean | undefined;
        shouldShowEditButton?: boolean | undefined;
        editFieldName?: string | undefined;
        callbacks?: Function | undefined;
    };
    /**
     * Executes the assessment and returns a result based on the research.
     *
     * @param {Paper}       paper       The paper to use for the assessment.
     *
     * @returns {AssessmentResult} An assessment result with the score and formatted text.
     */
    getResult(paper: Paper): AssessmentResult;
    /**
     * Checks whether the assessment is applicable. It is applicable unless the product has variants, and we don't want to
     * assess variants (this is the case for Shopify since we cannot at the moment easily access variant data in Shopify).
     *
     * @param {Paper} paper The paper to check.
     *
     * @returns {Boolean} Whether the assessment is applicable.
     */
    isApplicable(paper: Paper): boolean;
    /**
     * Returns a score based on whether the product (variants) have an identifier.
     *
     * @param {Object} productIdentifierData  Whether product has variants, global identifier, and variant identifiers.
     * @param {Object} config                 The configuration to use.
     *
     * @returns {{score: number, text: string} | {}}	The result object with score and text
     * 													or empty object if no score should be returned.
     */
    scoreProductIdentifier(productIdentifierData: Object, config: Object): {
        score: number;
        text: string;
    } | {};
    /**
     * Gets the feedback strings for the assessment.
     * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
     * The callback function should return an object with the following properties:
     * - good: {withoutVariants: string, withVariants: string}
     * - okay: {withoutVariants: string, withVariants: string}
     *
     * @returns {{good: {withoutVariants: string, withVariants: string}, okay: {withoutVariants: string, withVariants: string}}} The feedback strings.
     */
    getFeedbackStrings(): {
        good: {
            withoutVariants: string;
            withVariants: string;
        };
        okay: {
            withoutVariants: string;
            withVariants: string;
        };
    };
}
import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";

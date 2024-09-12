import { mapValues, merge } from "lodash";

import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * Represents the assessment checks whether the product has a SKU.
 */
export default class ProductSKUAssessment extends Assessment {
	/**
	 * Constructs a product SKU assessment.
	 *
	 * @param {Object} config   Potential additional config for the assessment.
	 * @param {Object} [config.scores] The scores to use for the assessment.
	 * @param {number} [config.scores.good] The score to return if the product has a SKU.
	 * @param {number} [config.scores.ok] The score to return if the product doesn't have a SKU.
	 * @param {string} [config.urlTitle] The URL to the article about this assessment.
	 * @param {string} [config.urlCallToAction] The URL to the help article for this assessment.
	 * @param {boolean} [config.assessVariants] Whether to assess variants.
	 * @param {boolean} [config.shouldShowEditButton] Whether to show edit button.
	 * @param {string} [config.editFieldName] The name of the field to edit.
	 * @param {object} [config.callbacks] The callbacks to use for the assessment.
	 * @param {function} [config.callbacks.getResultTexts] The function that returns the result texts.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			scores: {
				good: 9,
				ok: 6,
			},
			urlTitle: "https://yoa.st/4lw",
			urlCallToAction: "https://yoa.st/4lx",
			assessVariants: false,
			shouldShowEditButton: false,
			editFieldName: "SKU",
			callbacks: {},
		};

		this.identifier = "productSKU";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Executes the assessment and returns a result based on the research.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {AssessmentResult} An assessment result with the score and formatted text.
	 */
	getResult( paper ) {
		const productSKUData = paper.getCustomData();

		const result = this.scoreProductSKU( productSKUData, this._config );

		const assessmentResult = new AssessmentResult();

		if ( result ) {
			assessmentResult.setScore( result.score );
			assessmentResult.setText( result.text );
		}

		if ( assessmentResult.getScore() < 9 && this._config.shouldShowEditButton ) {
			assessmentResult.setHasJumps( true );
			// Provide `this._config.editFieldName` when initialize this assessment with the value "SKU". We recommend to provide the string as a translation string.
			assessmentResult.setEditFieldName( this._config.editFieldName );
		}

		return assessmentResult;
	}

	/**
	 * Checks whether the assessment is applicable.
	 * It is not applicable when the product has variants, and we don't want to assess variants (this is the case for Shopify
	 * since we cannot at the moment easily access variant data in Shopify).
	 * It is also not applicable when we cannot retrieve the SKU (this can be the case if other plugins remove/change the SKU
	 * input field in such as way that we cannot detect it).
	 *
	 * @param {Paper} paper The paper to check.
	 *
	 * @returns {Boolean} Whether the assessment is applicable.
	 */
	isApplicable( paper ) {
		const customData = paper.getCustomData();

		/*
	    * If the global SKU cannot be retrieved, the assessment shouldn't be applicable if the product is a simple
	    * or external product, or doesn't have variants. Even though in reality a simple or external product doesn't have variants,
	    * this double check is added because the hasVariants variable doesn't always update correctly when changing product type.
	    */
		if ( customData.canRetrieveGlobalSku === false &&
			( [ "simple", "external" ].includes( customData.productType ) || customData.hasVariants === false ) ) {
			return false;
		}

		// If variant identifiers cannot be retrieved for a variable product with variants, the assessment shouldn't be applicable.
		if ( customData.canRetrieveVariantSkus === false && customData.hasVariants === true && customData.productType === "variable" ) {
			return false;
		}

		// Assessment is not applicable if we don't want to assess variants and the product has variants.
		return ! ( this._config.assessVariants === false && customData.hasVariants );
	}

	/**
	 * Returns a score based on whether the product (variants) have a SKU.
	 *
	 * @param {Object} productSKUData	Whether product has variants, global SKU, and variant SKU.
	 * @param {Object} config			The configuration to use.
	 *
	 * @returns {{score: number, text: string} | {}}	The result object with score and text
	 * 													or empty object if no score should be returned.
	 */
	scoreProductSKU( productSKUData, config ) {
		const { good, okay } = this.getFeedbackStrings();
		// Apply the following scoring conditions to products without variants.
		if ( [ "simple", "external", "grouped" ].includes( productSKUData.productType ) ||
			( productSKUData.productType === "variable" && ! productSKUData.hasVariants ) ) {
			if ( ! productSKUData.hasGlobalSKU ) {
				return {
					score: config.scores.ok,
					text: okay.withoutVariants,
				};
			}
			return {
				score: config.scores.good,
				text: good.withoutVariants,
			};
		} else if ( productSKUData.productType === "variable" && productSKUData.hasVariants ) {
			// If we want to assess variants, if product has variants and not all variants have a SKU, return orange bullet.
			// If all variants have a SKU, return green bullet.
			if ( ! productSKUData.doAllVariantsHaveSKU ) {
				return {
					score: config.scores.ok,
					text: okay.withVariants,
				};
			}
			return {
				score: config.scores.good,
				text: good.withVariants,
			};
		}
		return {};
	}

	/**
	 * Gets the feedback strings for the assessment.
	 * If you want to override the feedback strings, you can do so by providing a custom callback in the config: `this._config.callbacks.getResultTexts`.
	 * The callback function should return an object with the following properties:
	 * - good: {withoutVariants: string, withVariants: string}
	 * - okay: {withoutVariants: string, withVariants: string}
	 *
	 * @returns {{good: {withoutVariants: string, withVariants: string}, okay: {withoutVariants: string, withVariants: string}}} The feedback strings.
	 */
	getFeedbackStrings() {
		// `urlTitleAnchorOpeningTag` represents the anchor opening tag with the URL to the article about this assessment.
		const urlTitleAnchorOpeningTag = createAnchorOpeningTag( this._config.urlTitle );
		// `urlActionAnchorOpeningTag` represents the anchor opening tag with the URL for the call to action.
		const urlActionAnchorOpeningTag = createAnchorOpeningTag( this._config.urlCallToAction );

		if ( ! this._config.callbacks.getResultTexts ) {
			const defaultResultTexts = {
				good: {
					withoutVariants: "%1$sSKU%3$s: Your product has a SKU. Good job!",
					withVariants: "%1$sSKU%3$s: All your product variants have a SKU. Good job!",
				},
				okay: {
					withoutVariants: "%1$sSKU%3$s: Your product is missing a SKU. %2$sInclude it if you can, as it will help search engines to better understand your content.%3$s",
					withVariants: "%1$sSKU%3$s: Not all your product variants have a SKU. %2$sInclude it if you can, as it will help search engines to better understand your content.%3$s",
				},
			};
			defaultResultTexts.good = mapValues(
				defaultResultTexts.good,
				( resultText ) => this.formatResultText( resultText, urlTitleAnchorOpeningTag, urlActionAnchorOpeningTag )
			);
			defaultResultTexts.okay = mapValues(
				defaultResultTexts.okay,
				( resultText ) => this.formatResultText( resultText, urlTitleAnchorOpeningTag, urlActionAnchorOpeningTag )
			);
			return defaultResultTexts;
		}

		return this._config.callbacks.getResultTexts( {
			urlTitleAnchorOpeningTag,
			urlActionAnchorOpeningTag,
		} );
	}
}

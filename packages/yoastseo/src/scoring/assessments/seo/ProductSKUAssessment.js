import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { merge } from "lodash-es";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Represents the assessment for the product SKU.
 */
export default class ProductSKUAssessment extends Assessment {
	/**
	 * Constructs a product SKU assessment.
	 *
	 * @param {Object} config   Potential additional config for the assessment.
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
			urlTitle: createAnchorOpeningTag( "https://yoa.st/4lw" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/4lx" ),
			assessVariants: true,
			addSKULocation: false,
		};

		this.identifier = "productSKU";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Tests whether a product has a SKU and returns an assessment result based on the research.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
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

		return assessmentResult;
	}

	/**
	 * Checks whether the assessment is applicable.
	 * It is not applicable when the product has variants and we don't want to assess variants (this is the case for Shopify
	 * since we cannot at the moment easily access variant data in Shopify).
	 * It is also not applicable when we cannot retrieve the SKU (this can be the case if other plugins remove/change the SKU
	 * input field in such as way that we cannot detect it.
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
	 * @param {Object} productSKUData         Whether product has variants, global SKU, and variant SKU.
	 * @param {Object} config                 The configuration to use.
	 *
	 * @returns {{score: number, text: string} | {}}	The result object with score and text
	 * 													or empty object if no score should be returned.
	 */
	scoreProductSKU( productSKUData, config ) {
		// Check if we want to add information about where to add the SKU in the feedback string or not.
		// Currently we want to implement it only for Woo Product pages.
		let feedbackString = "";
		if ( this._config.addSKULocation === true ) {
			// Translators: please keep the space at the start of the sentence in your translation unless your language does not use spaces.
			feedbackString = __( " You can add a SKU via the \"Inventory\" tab in the Product data box.", "wordpress-seo" );
		}

		// Apply the following scoring conditions to products without variants.
		if ( [ "simple", "external", "grouped" ].includes( productSKUData.productType ) ||
			( productSKUData.productType === "variable" && ! productSKUData.hasVariants ) ) {
			if ( ! productSKUData.hasGlobalSKU ) {
				return {
					score: config.scores.ok,
					text: sprintf(
						// Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag.
						// %4$s expands to "You can add a SKU via the "Inventory" tab in the Product data box." or to an empty string.
						__(
							"%1$sSKU%3$s: Your product is missing a SKU.%4$s" +
							" %2$sInclude it if you can, as it will help search engines to better understand your content.%3$s",
							"wordpress-seo"
						),
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>",
						feedbackString
					),
				};
			}
			return {
				score: config.scores.good,
				text: sprintf(
					// Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag.
					__(
						"%1$sSKU%2$s: Your product has a SKU. Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		} else if ( productSKUData.productType === "variable" && productSKUData.hasVariants ) {
			// If we want to assess variants, if product has variants and not all variants have a SKU, return orange bullet.
			// If all variants have a SKU, return green bullet.
			if ( ! productSKUData.doAllVariantsHaveSKU ) {
				return {
					score: config.scores.ok,
					text: sprintf(
						// Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag.
						__(
							"%1$sSKU%3$s: Not all your product variants have a SKU. " +
							"You can add a SKU via the \"Variations\" tab in the Product data box." +
							" %2$sInclude it if you can, as it will help search engines to better understand your content.%3$s",
							"wordpress-seo"
						),
						this._config.urlTitle,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}
			return {
				score: config.scores.good,
				text: sprintf(
					// Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag.
					__(
						"%1$sSKU%2$s: All your product variants have a SKU. Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}
		return {};
	}
}

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
			assessVariants: false,
		};

		this.identifier = "productSKU";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Tests whether a product has a SKU and returns an assessment result based on the research.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling the research.
	 *
	 * @returns {AssessmentResult} An assessment result with the score and formatted text.
	 */
	getResult( paper, researcher ) {
		const productSKUData = researcher.getResearch( "getProductSKUData" );

		const result = this.scoreProductSKU( productSKUData, this._config );

		const assessmentResult = new AssessmentResult();

		if ( result ) {
			assessmentResult.setScore( result.score );
			assessmentResult.setText( result.text );
		}

		return assessmentResult;
	}

	/**
	 * Checks whether the assessment is applicable. Currently it is applicable when variants should be assessed (i.e.
	 * in WooCommerce, but not in Shopify)
	 *
	 * @returns {Boolean} Whether the assessment is applicable.
	 */
	isApplicable() {
		return this._config.assessVariants;
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
		// If a product has no variants, return orange bullet if it has no global SKU, and green bullet if it has one.
		if ( ! productSKUData.hasVariants ) {
			if ( ! productSKUData.hasGlobalSKU ) {
				return {
					score: config.scores.ok,
					text: sprintf(
						// Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag.
						__(
							"%1$sSKU%3$s: Your product is missing a SKU. %2$sInclude this if you can, as it" +
							" will help search engines to better understand your content.%3$s",
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
						"%1$sSKU%2$s: Your product has a SKU. Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					"</a>"
				),
			};
		}

		// Don't return a score if the product has variants but we don't want to assess variants for this product.
		// This is currently the case for Shopify products because we don't have access data about product variant identifiers in Shopify.
		if ( ! config.assessVariants ) {
			return {};
		}

		// If we want to assess variants, if product has variants and not all variants have a SKU, return orange bullet.
		// If all variants have a SKU, return green bullet.
		if ( ! productSKUData.doAllVariantsHaveSKU ) {
			return {
				score: config.scores.ok,
				text: sprintf(
					// Translators: %1$s and %2$s expand to links on yoast.com, %3$s expands to the anchor end tag.
					__(
						"%1$sSKU%3$s: Not all your product variants have a SKU. %2$sInclude this if you can, as it" +
						" will help search engines to better understand your content.%3$s",
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
}

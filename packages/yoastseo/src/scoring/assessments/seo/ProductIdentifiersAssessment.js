import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { merge } from "lodash-es";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import { __, sprintf } from "@wordpress/i18n";

/**
 * Represents the assessment for the product identifiers.
 */
export default class ProductIdentifiersAssessment extends Assessment {
	/**
	 * Constructs a product identifier assessment.
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
			urlTitle: createAnchorOpeningTag( "https://yoa.st/4ly" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/4lz" ),
			assessVariants: true,
			productIdentifierOrBarcode: "Product identifier",
		};

		this.identifier = "productIdentifier";
		this._config = merge( defaultConfig, config );
		this.name = __( this._config.productIdentifierOrBarcode, "wordpress-seo" );
	}

	/**
	 * Tests whether a product has product identifiers and returns an assessment result based on the research.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 *
	 * @returns {AssessmentResult} An assessment result with the score and formatted text.
	 */
	getResult( paper ) {
		const productIdentifierData = paper.getCustomData();

		const result = this.scoreProductIdentifier( productIdentifierData, this._config );

		const assessmentResult = new AssessmentResult();

		if ( result ) {
			assessmentResult.setScore( result.score );
			assessmentResult.setText( result.text );
		}

		return assessmentResult;
	}

	/**
	 * Checks whether the assessment is applicable. It is applicable unless the product has variants and we don't want to
	 * assess variants (this is the case for Shopify since we cannot at the moment easily access variant data in Shopify).
	 *
	 * @param {Paper} paper The paper to check.
	 *
	 * @returns {Boolean} Whether the assessment is applicable.
	 */
	isApplicable( paper ) {
		const customData = paper.getCustomData();

		/*
		 * If the global identifier cannot be retrieved, the assessment shouldn't be applicable if the product is a simple
		 * or external product, or doesn't have variants. Even though in reality a simple or external product doesn't have variants,
		 * this double check is added because the hasVariants variable doesn't always update correctly when changing product type.
		 */
		if ( customData.canRetrieveGlobalIdentifier === false &&
			( [ "simple", "external", "grouped" ].includes( customData.productType ) || customData.hasVariants === false ) ) {
			return false;
		}

		// If variant identifiers cannot be retrieved for a variable product with variants, the assessment shouldn't be applicable.
		if ( customData.canRetrieveVariantIdentifiers === false && customData.hasVariants === true && customData.productType === "variable" ) {
			return false;
		}

		// Assessment is not applicable if we don't want to assess variants and the product has variants.
		return ! ( this._config.assessVariants === false && customData.hasVariants );
	}

	/**
	 * Returns a score based on whether the product (variants) have an identifier.
	 *
	 * @param {Object} productIdentifierData  Whether product has variants, global identifier, and variant identifiers.
	 * @param {Object} config                 The configuration to use.
	 *
	 * @returns {{score: number, text: string} | {}}	The result object with score and text
	 * 													or empty object if no score should be returned.
	 */
	scoreProductIdentifier( productIdentifierData, config ) {
		let feedbackStrings;

		if ( this._config.productIdentifierOrBarcode === "Product identifier" ) {
			feedbackStrings = {
				okNoVariants: __( "Your product is missing an identifier (like a GTIN code). " +
					"You can add a product identifier via the \"Yoast SEO\" tab in the Product data box", "wordpress-seo" ),
				goodNoVariants: __( "Your product has an identifier", "wordpress-seo" ),
				okWithVariants: __( "Not all your product variants have an identifier. " +
					"You can add a product identifier via the \"Variations\" tab in the Product data box", "wordpress-seo" ),
				goodWithVariants: __( "All your product variants have an identifier", "wordpress-seo" ),
			};
		} else {
			feedbackStrings = {
				okNoVariants: __( "Your product is missing a barcode (like a GTIN code)", "wordpress-seo" ),
				goodNoVariants: __( "Your product has a barcode", "wordpress-seo" ),
				okWithVariants: __( "Not all your product variants have a barcode", "wordpress-seo" ),
				goodWithVariants: __( "All your product variants have a barcode", "wordpress-seo" ),
			};
		}

		// Apply the following scoring conditions to products without variants.
		if ( [ "simple", "external" ].includes( productIdentifierData.productType ) ||
			( productIdentifierData.productType === "variable" && ! productIdentifierData.hasVariants ) ) {
			if ( ! productIdentifierData.hasGlobalIdentifier ) {
				return {
					score: config.scores.ok,
					text: sprintf(
						/* Translators: %1$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
						* %2$s expands to the string "Barcode" or "Product identifier", %3$s expands to the feedback string
						* "Your product is missing a product identifier (like a GTIN code)"
						* or "Your product is missing a barcode (like a GTIN code)" */
						__(
							"%1$s%2$s%5$s: %3$s. %4$sInclude it if you can, as it " +
							"will help search engines to better understand your content.%5$s",
							"wordpress-seo"
						),
						this._config.urlTitle,
						this.name,
						feedbackStrings.okNoVariants,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}

			return {
				score: config.scores.good,
				text: sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %4$s expands to the anchor end tag,
					* %2$s expands to the string "Barcode" or "Product identifier", %3$s expands to the feedback string
					* "Your product has a product identifier" or "Your product has a barcode" */
					__(
						"%1$s%2$s%4$s: %3$s. Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this.name,
					feedbackStrings.goodNoVariants,
					"</a>"
				),
			};
		} else if ( productIdentifierData.productType === "variable" && productIdentifierData.hasVariants ) {
			if ( ! productIdentifierData.doAllVariantsHaveIdentifier ) {
				// If we want to assess variants, and if product has variants but not all variants have an identifier, return orange bullet.
				// If all variants have an identifier, return green bullet.
				return {
					score: config.scores.ok,
					text: sprintf(
						/* Translators: %1$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
						* %2$s expands to the string "Barcode" or "Product identifier", %3$s expands to the string
						* "Not all your product variants have a product identifier"
						* or "Not all your product variants have a barcode" */
						__(
							"%1$s%2$s%5$s: %3$s. %4$sInclude it if you can, as it will help search engines to better understand your content.%5$s",
							"wordpress-seo"
						),
						this._config.urlTitle,
						this.name,
						feedbackStrings.okWithVariants,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}
			return {
				score: config.scores.good,
				text: sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %4$s expands to the anchor end tag,
					* %2$s expands to the string "Barcode" or "Product identifier" , %3$s expands to the feedback string
					* "All your product variants have a product identifier" or "All your product variants have a barcode" */
					__(
						"%1$s%2$s%4$s: %3$s. Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this.name,
					feedbackStrings.goodWithVariants,
					"</a>"
				),
			};
		}
		return {};
	}
}

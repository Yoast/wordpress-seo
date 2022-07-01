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
			productIdentifierOrBarcode: {
				lowercase: "product identifier",
				uppercase: "",
			},
		};

		this.identifier = "productIdentifier";
		this._config = merge( defaultConfig, config );
		this._config.productIdentifierOrBarcode.lowercase = __( this._config.productIdentifierOrBarcode.lowercase, "wordpress-seo" );
		this._config.productIdentifierOrBarcode.uppercase =
			this._config.productIdentifierOrBarcode.lowercase[ 0 ].toUpperCase() + this._config.productIdentifierOrBarcode.lowercase.slice( 1 );
	}

	/**
	 * Tests whether a product has product identifiers and returns an assessment result based on the research.
	 *
	 * @param {Paper}       paper       The paper to use for the assessment.
	 * @param {Researcher}  researcher  The researcher used for calling the research.
	 *
	 * @returns {AssessmentResult} An assessment result with the score and formatted text.
	 */
	getResult( paper, researcher ) {
		const productIdentifierData = researcher.getResearch( "getProductIdentifierData" );

		const result = this.scoreProductIdentifier( productIdentifierData, this._config );

		const assessmentResult = new AssessmentResult();

		if ( result ) {
			assessmentResult.setScore( result.score );
			assessmentResult.setText( result.text );
		}

		return assessmentResult;
	}

	/**
	 * Returns a score based on whether the product (variants) have an identifier.
	 *
	 * @param {Object} productIdentifierData  Whether product has variants, global identifier, and variant identifiers.
	 * @param {Object} config                 The configuration to use.
	 *
	 * @returns {{score: number, text: *}} The result object with score and text.
	 */
	scoreProductIdentifier( productIdentifierData, config ) {
		// If a product has no variants, return orange bullet if it has no global identifier, and green bullet if it has one.
		if ( ! productIdentifierData.hasVariants ) {
			if ( ! productIdentifierData.hasGlobalIdentifier ) {
				return {
					score: config.scores.ok,
					text: sprintf(
						/* Translators: %1$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
						* %2$s expands to the string "Barcode" or "Product identifier", %3$s expands to the string "barcode"
						* or "product identifier" */
						__(
							"%1$s%2$s%5$s: Your product is missing a %3$s (like a GTIN code). %4$sInclude this if you can, as it" +
							" will help search engines to better understand your content.%5$s",
							"wordpress-seo"
						),
						this._config.urlTitle,
						this._config.productIdentifierOrBarcode.uppercase,
						this._config.productIdentifierOrBarcode.lowercase,
						this._config.urlCallToAction,
						"</a>"
					),
				};
			}
			return {
				score: config.scores.good,
				text: sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %3$s expands to the anchor end tag,
					* %2$s expands to the string "Barcode" or "Product identifier" */
					__(
						"%1$s%2$s%3$s: Good job!",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.productIdentifierOrBarcode.uppercase,
					"</a>"
				),
			};
		}

		// Don't return a score if the product has variants but we don't want to assess variants for this product.
		// This is currently the case for Shopify products because we don't have access data about product variant identifiers in Shopify.
		if ( ! config.assessVariants ) {
			return;
		}

		// If WooCommerce product has variants and not all variants have an identifier, return orange bullet.
		// If all variants have an identifier, return green bullet.
		if ( ! productIdentifierData.doAllVariantsHaveIdentifier ) {
			return {
				score: config.scores.ok,
				text: sprintf(
					/* Translators: %1$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
					* %2$s expands to the string "Barcode" or "Product identifier", %3$s expands to the string "barcode"
					* or "product identifier" */
					__(
						"%1$s%2$s%5$s: Not all your product variants have a %3$s. %4$sInclude this if you can, as it" +
						" will help search engines to better understand your content.%5$s",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.productIdentifierOrBarcode.uppercase,
					this._config.productIdentifierOrBarcode.lowercase,
					this._config.urlCallToAction,
					"</a>"
				),
			};
		}

		return {
			score: config.scores.good,
			text: sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %3$s expands to the anchor end tag,
				* %2$s expands to the string "Barcode" or "Product identifier" */
				__(
					"%1$s%2$s%3$s: Good job!",
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.productIdentifierOrBarcode.uppercase,
				"</a>"
			),
		};
	}
}

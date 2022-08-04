import { defaultConfig } from "eslint-plugin-react/lib/rules/sort-comp";
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
				invalidVariantData: 0,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/4ly" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/4lz" ),
			assessVariants: false,
			// In which plugin the strings will be output. If isWoo is false, then it is Shopify.
			isWoo: true,
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
	 * Checks whether the assessment is applicable. Currently it is applicable when variants should be assessed (i.e.
	 * in WooCommerce, but not in Shopify)
	 *
	 * @returns {Boolean} Whether the assessment is applicable.
	 */
	isApplicable() {
		return this._config.assessVariants;
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
		// Return a grey bullet if the variant identifier data is not valid.
		// This can currently occur in WooCommerce because we cannot know what kind of bulk action the user performed without them reloading the page.
		if ( productIdentifierData.isVariantIdentifierDataValid === false  ) {
			return {
				score: config.scores.invalidVariantData,
				text: sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %3$s expands to the anchor end tag,
					* %2$s expands to the string "Barcode" or "Product identifier". */
					__(
						"%1$s%2$s%3$s: Please save and refresh the page to view the result for this assessment.",
						"wordpress-seo"
					),
					this._config.urlTitle,
					this._config.productIdentifierOrBarcode.uppercase,
					"</a>"
				),
			};
		}

		// If a product has no variants, return orange bullet if it has no global identifier, and green bullet if it has one.
		let feedbackString;
		if ( this.isWoo ) {
			feedbackString = "%1$s%2$s%4$s: Your product is missing a product identifier (like a GTIN code). %3$sInclude this if you can, as it " +
				"will help search engines to better understand your content.%4$s"
		} else {
			feedbackString = "%1$s%2$s%4$s: Your product is missing a barcode (like a GTIN code). %3$sInclude this if you can, as it " +
				"will help search engines to better understand your content.%4$s" }
		if ( ! productIdentifierData.hasVariants ) {
			if ( ! productIdentifierData.hasGlobalIdentifier ) {
				return {
					score: config.scores.ok,
					text: sprintf(
						/* Translators: %1$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
						* %2$s expands to the string "Barcode" or "Product identifier", %3$s expands to the string "barcode"
						* or "product identifier" */
						__(
							feedbackString,
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
			let feedbackString;
			if ( this.isWoo ) {
				feedbackString = "%1$s%2$s%3$s: Your product has a product identifier. Good job!";
			} else {
				feedbackString = "%1$s%2$s%3$s: Your product has a barcode. Good job!" }
			return {
				score: config.scores.good,
				text: sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %3$s expands to the anchor end tag,
					* %2$s expands to the string "Barcode" or "Product identifier" */
					__(
						feedbackString,
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
			return {};
		}

		// If we want to assess variants, and if product has variants but not all variants have an identifier, return orange bullet.
		// If all variants have an identifier, return green bullet.
		if ( this.isWoo ) {
			feedbackString = "%1$s%2$s%4$s: Not all your product variants have a product identifier. %3$sInclude this if you can, as it" +
				" will help search engines to better understand your content.%5$s";
		} else {
			feedbackString = "%1$s%2$s%4$s: Not all your product variants have a barcode. %3$sInclude this if you can, as it" +
				" will help search engines to better understand your content.%5$s" }
		if ( ! productIdentifierData.doAllVariantsHaveIdentifier ) {
			return {
				score: config.scores.ok,
				text: sprintf(
					/* Translators: %1$s and %4$s expand to links on yoast.com, %5$s expands to the anchor end tag,
					* %2$s expands to the string "Barcode" or "Product identifier", %3$s expands to the string "barcode"
					* or "product identifier" */
					__(
						feedbackString,
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
		if ( this.isWoo ) {
			feedbackString = "%1$s%2$s%3$s: All your product variants have a product identifier. Good job!";
		} else {
			feedbackString = "%1$s%2$s%3$s: All your product variants have a barcode. Good job!" }
		return {
			score: config.scores.good,
			text: sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %3$s expands to the anchor end tag,
				* %2$s expands to the string "Barcode" or "Product identifier" */
				__(
					feedbackString,
					"wordpress-seo"
				),
				this._config.urlTitle,
				this._config.productIdentifierOrBarcode.uppercase,
				"</a>"
			),
		};
	}
}

import Assessment from "../assessment";
import AssessmentResult from "../../../values/AssessmentResult";
import { merge } from "lodash-es";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";

/**
 * Represents the assessment for the product identifiers.
 */
export default class ProductIdentifiersAssessment extends Assessment {
	/**
	 * Constructs a product identifier assessment.
	 *
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
			urlTitle: createAnchorOpeningTag( "https://yoast.com" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoast.com" ),
			isWoo: false,
		};

		this.identifier = "productIdentifier";
		this._config = merge( defaultConfig, config );
	}

	isApplicable() {
		return true;
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
		let productIdentifierData;
		console.log( this._config.isWoo, "is woo before if statement" );
		if ( this._config.isWoo ) {
			console.log( "is woo" );
			productIdentifierData = researcher.getResearch( "getProductIdentifierDataWooCommerce" );
		} else {
			productIdentifierData = researcher.getResearch( "getProductIdentifierDataShopify" );
		}

		const result = this.scoreProductIdentifier( productIdentifierData, this._config );

		const assessmentResult = new AssessmentResult();
		assessmentResult.setScore( result.score );
		assessmentResult.setText( result.text );

		return assessmentResult;
	}

	/**
	 * Returns the score based on the length of the product description.
	 *
	 * @param {Object} productIdentifierData   Whether the product has at least one product identifier filled in.
	 * @param {Object} config                 The configuration to use.
	 *
	 * @returns {{score: number, text: *}} The result object with score and text.
	 */
	scoreProductIdentifier( productIdentifierData, config ) {
		if ( productIdentifierData.hasVariants ) {
			if ( ! productIdentifierData.doAllVariantsHaveIdentifier ) {
				return {
					score: config.scores.ok,
					text: "Feedback for orange",
				};
			}
		}
		if ( ! productIdentifierData.hasGlobalIdentifier ) {
			return {
				score: config.scores.ok,
				text: "A different feedback for orange",
			};
		}
		return {
			score: config.scores.good,
			text: "Feedback for green",
		};
	}
}

import { inherits } from "util";

import Assessor from "../../assessor";
import IntroductionKeywordAssessment from "../../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../../../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import MetaDescriptionLengthAssessment from "../../../assessments/seo/MetaDescriptionLengthAssessment.js";
import TextLengthAssessment from "../../../assessments/seo/TextLengthAssessment.js";
import KeyphraseInSEOTitleAssessment from "../../../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import PageTitleWidthAssessment from "../../../assessments/seo/PageTitleWidthAssessment.js";
import SlugKeywordAssessment from "../../../assessments/seo/UrlKeywordAssessment.js";
import SingleH1Assessment from "../../../assessments/seo/SingleH1Assessment.js";

import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * Creates the Assessor used for collection pages.
 *
 * @param {Researcher} researcher   The researcher used for the analysis.
 * @param {Object?} options         The options for this assessor.
 * @constructor
 */
const CollectionCornerstoneSEOAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "collectionCornerstoneSEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify8" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify9" ),
		} ),
		new KeyphraseLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
		} ),
		new KeyphraseDensityAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify12" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify13" ),
		} ),
		new MetaDescriptionKeywordAssessment(
			{
				parameters: { recommendedMinimum: 1 },
				scores: { good: 9, bad: 3 },
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
			}
		),
		new MetaDescriptionLengthAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
		} ),
		new TextLengthAssessment( {
			recommendedMinimum: 30,
			slightlyBelowMinimum: 10,
			veryFarBelowMinimum: 1,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify58" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify59" ),
			cornerstoneContent: true,
			customContentType: this.type,
		} ),
		new KeyphraseInSEOTitleAssessment(
			{
				parameters: {
					recommendedPosition: 0,
				},
				scores: {
					good: 9,
					bad: 2,
				},
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
			}
		),
		new PageTitleWidthAssessment( {
			scores: {
				widthTooShort: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify52" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify53" ),
		}, true ),
		new SlugKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify26" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify27" ),
		} ),
		new FunctionWordsInKeyphraseAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
		} ),
		new SingleH1Assessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify54" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify55" ),
		} ),
	];
};

inherits( CollectionCornerstoneSEOAssessor, Assessor );

export default CollectionCornerstoneSEOAssessor;

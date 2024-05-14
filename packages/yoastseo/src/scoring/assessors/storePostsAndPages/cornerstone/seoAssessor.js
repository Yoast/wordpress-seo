import { inherits } from "util";

import Assessor from "../../assessor.js";
import SeoAssessor from "../../seoAssessor.js";
import IntroductionKeywordAssessment from "../../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../../../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import MetaDescriptionLengthAssessment from "../../../assessments/seo/MetaDescriptionLengthAssessment.js";
import SubheadingsKeywordAssessment from "../../../assessments/seo/SubHeadingsKeywordAssessment.js";
import TextCompetingLinksAssessment from "../../../assessments/seo/TextCompetingLinksAssessment.js";
import ImageKeyphraseAssessment from "../../../assessments/seo/KeyphraseInImageTextAssessment.js";
import ImageCountAssessment from "../../../assessments/seo/ImageCountAssessment.js";
import TextLengthAssessment from "../../../assessments/seo/TextLengthAssessment.js";
import OutboundLinksAssessment from "../../../assessments/seo/OutboundLinksAssessment.js";
import KeyphraseInSEOTitleAssessment from "../../../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import InternalLinksAssessment from "../../../assessments/seo/InternalLinksAssessment.js";
import PageTitleWidthAssessment from "../../../assessments/seo/PageTitleWidthAssessment.js";
import SlugKeywordAssessment from "../../../assessments/seo/UrlKeywordAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import SingleH1Assessment from "../../../assessments/seo/SingleH1Assessment.js";

import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * Creates the Assessor
 *
 * @param {Researcher} researcher     The researcher used for the analysis.
 * @param {Object?} options           The options for this assessor.
 * @param {Function} options.marker   The marker to pass the list of marks to.
 *
 * @constructor
 */
const StorePostsAndPagesCornerstoneSEOAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "storePostsAndPagesCornerstoneSEOAssessor";

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
		new MetaDescriptionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
		} ),
		new MetaDescriptionLengthAssessment( {
			scores:	{
				tooLong: 3,
				tooShort: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
		} ),
		new SubheadingsKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify16" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify17" ),
		} ),
		new TextCompetingLinksAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify18" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify19" ),
		} ),
		new ImageKeyphraseAssessment( {
			scores: {
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify22" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify23" ),
		} ),
		new ImageCountAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify20" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify21" ),
		} ),
		new TextLengthAssessment( {
			recommendedMinimum: 900,
			slightlyBelowMinimum: 400,
			belowMinimum: 300,

			scores: {
				belowMinimum: -20,
				farBelowMinimum: -20,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify58" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify59" ),
			cornerstoneContent: true,
		} ),
		new OutboundLinksAssessment( {
			scores: {
				noLinks: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify62" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify63" ),
		} ),
		new KeyphraseInSEOTitleAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
		} ),
		new InternalLinksAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify60" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify61" ),
		} ),
		new PageTitleWidthAssessment( {
			scores: {
				widthTooShort: 9,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify52" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify53" ),
		}, true ),
		new SlugKeywordAssessment(
			{
				scores: {
					okay: 3,
				},
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify26" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify27" ),
			}
		),
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

inherits( StorePostsAndPagesCornerstoneSEOAssessor, SeoAssessor );

export default StorePostsAndPagesCornerstoneSEOAssessor;

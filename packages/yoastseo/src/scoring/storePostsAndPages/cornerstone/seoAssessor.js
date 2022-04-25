import { inherits } from "util";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";

import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "../../assessments/seo/TextCompetingLinksAssessment";
import InternalLinksAssessment from "../../assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "../../assessments/seo/TitleKeywordAssessment";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment";
import Assessor from "../../assessor";
import SEOAssessor from "../seoAssessor";
import MetaDescriptionLength from "../../assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeyword from "../../assessments/seo/SubHeadingsKeywordAssessment";
import ImageKeyphrase from "../../assessments/seo/KeyphraseInImageTextAssessment";
import ImageCount from "../../assessments/seo/ImageCountAssessment";
import TextLength from "../../assessments/seo/TextLengthAssessment";
import OutboundLinks from "../../assessments/seo/OutboundLinksAssessment";
import TitleWidth from "../../assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "../../assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "../../assessments/seo/SingleH1Assessment";
import KeyphraseDistribution from "../../assessments/seo/KeyphraseDistributionAssessment";


/**
 * Creates the Assessor
 *
 * @param {object} researcher       The researcher used for the analysis.
 * @param {Object} options          The options for this assessor.
 * @param {Object} options.marker   The marker to pass the list of marks to.
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
		new KeywordDensityAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify12" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify13" ),
		} ),
		new MetaDescriptionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
		} ),
		new MetaDescriptionLength( {
			scores:	{
				tooLong: 3,
				tooShort: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
		} ),
		new SubheadingsKeyword( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify16" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify17" ),
		} ),
		new TextCompetingLinksAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify18" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify19" ),
		} ),
		new ImageKeyphrase( {
			scores: {
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify22" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify23" ),
		} ),
		new ImageCount( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify20" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify21" ),
		} ),
		new TextLength( {
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
		new OutboundLinks( {
			scores: {
				noLinks: 3,
			},
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify62" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify63" ),
		} ),
		new TitleKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
		} ),
		new InternalLinksAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify60" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify61" ),
		} ),
		new TitleWidth( {
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
		new FunctionWordsInKeyphrase( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
		} ),
		new SingleH1Assessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify54" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify55" ),
		} ),
		new KeyphraseDistribution( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify30" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify31" ),
		} ),
	];
};

inherits( StorePostsAndPagesCornerstoneSEOAssessor, SEOAssessor );

export default StorePostsAndPagesCornerstoneSEOAssessor;

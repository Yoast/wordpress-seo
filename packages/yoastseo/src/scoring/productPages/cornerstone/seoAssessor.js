import { inherits } from "util";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";
import ImageAltTags from "../../assessments/seo/ImageAltTagsAssessment";

import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment";
import TextCompetingLinksAssessment from "../../assessments/seo/TextCompetingLinksAssessment";
import KeyphraseInSEOTitleAssessment from "../../assessments/seo/KeyphraseInSEOTitleAssessment";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment";
import Assessor from "../../assessor";
import SEOAssessor from "../seoAssessor";
import MetaDescriptionLength from "../../assessments/seo/MetaDescriptionLengthAssessment";
import SubheadingsKeyword from "../../assessments/seo/SubHeadingsKeywordAssessment";
import ImageKeyphrase from "../../assessments/seo/KeyphraseInImageTextAssessment";
import ImageCount from "../../assessments/seo/ImageCountAssessment";
import TextLength from "../../assessments/seo/TextLengthAssessment";
import TitleWidth from "../../assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "../../assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "../../assessments/seo/SingleH1Assessment";
import KeyphraseDistribution from "../../assessments/seo/KeyphraseDistributionAssessment";

/**
 * Creates the Assessor
 *
 * @param {object} researcher   The researcher to use for the analysis.
 * @param {Object} options      The options for this assessor.
 *
 * @constructor
 */
const ProductCornerstoneSEOAssessor = function( researcher, options ) {
	Assessor.call( this, researcher, options );
	this.type = "productCornerstoneSEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( options.introductionKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.introductionKeyphraseCTAUrl ),
		} ),
		new KeyphraseLengthAssessment( {
			parameters: {
				recommendedMinimum: 4,
				recommendedMaximum: 6,
				acceptableMaximum: 8,
				acceptableMinimum: 2,
			},
			urlTitle: createAnchorOpeningTag( options.keyphraseLengthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.keyphraseLengthCTAUrl ),
		}, true ),
		new KeywordDensityAssessment( {
			urlTitle: createAnchorOpeningTag( options.keyphraseDensityUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.keyphraseDensityCTAUrl ),
		} ),
		new MetaDescriptionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( options.metaDescriptionKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.metaDescriptionKeyphraseCTAUrl ),
		} ),
		new MetaDescriptionLength( {
			scores:	{
				tooLong: 3,
				tooShort: 3,
			},
			urlTitle: createAnchorOpeningTag( options.metaDescriptionLengthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.metaDescriptionLengthCTAUrl ),
		} ),
		new SubheadingsKeyword( {
			urlTitle: createAnchorOpeningTag( options.subheadingsKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.subheadingsKeyphraseCTAUrl ),
		} ),
		new TextCompetingLinksAssessment( {
			urlTitle: createAnchorOpeningTag( options.textCompetingLinksUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.textCompetingLinksCTAUrl ),
		} ),
		new TextLength( {
			recommendedMinimum: 400,
			slightlyBelowMinimum: 300,
			belowMinimum: 200,

			scores: {
				belowMinimum: -20,
				farBelowMinimum: -20,
			},
			urlTitle: createAnchorOpeningTag( options.textLengthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.textLengthCTAUrl ),
			cornerstoneContent: true,
			customContentType: this.type,
		} ),
		new KeyphraseInSEOTitleAssessment( {
			urlTitle: createAnchorOpeningTag( options.titleKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.titleKeyphraseCTAUrl ),
		} ),
		new TitleWidth( {
			scores: {
				widthTooShort: 9,
			},
			urlTitle: createAnchorOpeningTag( options.titleWidthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.titleWidthCTAUrl ),
		}, true ),
		new SlugKeywordAssessment(
			{
				scores: {
					okay: 3,
				},
				urlTitle: createAnchorOpeningTag( options.urlKeyphraseUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.urlKeyphraseCTAUrl ),
			}
		),
		new FunctionWordsInKeyphrase( {
			urlTitle: createAnchorOpeningTag( options.functionWordsInKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.functionWordsInKeyphraseCTAUrl ),
		} ),
		new SingleH1Assessment( {
			urlTitle: createAnchorOpeningTag( options.singleH1UrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.singleH1CTAUrl ),
		} ),
		new ImageCount( {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
			urlTitle: createAnchorOpeningTag( options.imageCountUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.imageCountCTAUrl ),
		}, options.countVideos ),
		new ImageKeyphrase( {
			scores: {
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3,
			},
			urlTitle: createAnchorOpeningTag( options.imageKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.imageKeyphraseCTAUrl ),
		} ),
		new ImageAltTags( {
			urlTitle: createAnchorOpeningTag( options.imageAltTagsUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.imageAltTagsCTAUrl ),
		}
		),
		new KeyphraseDistribution( {
			urlTitle: createAnchorOpeningTag( options.keyphraseDistributionUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.keyphraseDistributionCTAUrl ),
		} ),
	];
};

inherits( ProductCornerstoneSEOAssessor, SEOAssessor );

export default ProductCornerstoneSEOAssessor;

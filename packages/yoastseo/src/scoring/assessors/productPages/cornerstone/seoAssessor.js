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
import TextLengthAssessment from "../../../assessments/seo/TextLengthAssessment.js";
import KeyphraseInSEOTitleAssessment from "../../../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import PageTitleWidthAssessment from "../../../assessments/seo/PageTitleWidthAssessment.js";
import SlugKeywordAssessment from "../../../assessments/seo/UrlKeywordAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import SingleH1Assessment from "../../../assessments/seo/SingleH1Assessment.js";
import ImageCountAssessment from "../../../assessments/seo/ImageCountAssessment.js";
import ImageKeyphraseAssessment from "../../../assessments/seo/KeyphraseInImageTextAssessment.js";
import ImageAltTagsAssessment from "../../../assessments/seo/ImageAltTagsAssessment.js";
import ProductIdentifiersAssessment from "../../../assessments/seo/ProductIdentifiersAssessment.js";
import ProductSKUAssessment from "../../../assessments/seo/ProductSKUAssessment.js";

import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * Creates the Assessor
 *
 * @param {Researcher} researcher   The researcher to use for the analysis.
 * @param {Object?} options         The options for this assessor.
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
		new KeyphraseDensityAssessment( {
			urlTitle: createAnchorOpeningTag( options.keyphraseDensityUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.keyphraseDensityCTAUrl ),
		} ),
		new MetaDescriptionKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( options.metaDescriptionKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.metaDescriptionKeyphraseCTAUrl ),
		} ),
		new MetaDescriptionLengthAssessment( {
			scores:	{
				tooLong: 3,
				tooShort: 3,
			},
			urlTitle: createAnchorOpeningTag( options.metaDescriptionLengthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.metaDescriptionLengthCTAUrl ),
		} ),
		new SubheadingsKeywordAssessment( {
			urlTitle: createAnchorOpeningTag( options.subheadingsKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.subheadingsKeyphraseCTAUrl ),
		} ),
		new TextCompetingLinksAssessment( {
			urlTitle: createAnchorOpeningTag( options.textCompetingLinksUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.textCompetingLinksCTAUrl ),
		} ),
		new TextLengthAssessment( {
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
		new PageTitleWidthAssessment( {
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
		new FunctionWordsInKeyphraseAssessment( {
			urlTitle: createAnchorOpeningTag( options.functionWordsInKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.functionWordsInKeyphraseCTAUrl ),
		} ),
		new SingleH1Assessment( {
			urlTitle: createAnchorOpeningTag( options.singleH1UrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.singleH1CTAUrl ),
		} ),
		new ImageCountAssessment( {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
			urlTitle: createAnchorOpeningTag( options.imageCountUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.imageCountCTAUrl ),
		}, options.countVideos ),
		new ImageKeyphraseAssessment( {
			scores: {
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3,
			},
			urlTitle: createAnchorOpeningTag( options.imageKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.imageKeyphraseCTAUrl ),
		} ),
		new ImageAltTagsAssessment( {
			urlTitle: createAnchorOpeningTag( options.imageAltTagsUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.imageAltTagsCTAUrl ),
		} ),
		new ProductIdentifiersAssessment( {
			urlTitle: createAnchorOpeningTag( options.productIdentifierUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.productIdentifierCTAUrl ),
			assessVariants: options.assessVariants,
			productIdentifierOrBarcode: options.productIdentifierOrBarcode,
			shouldShowEditButton: options.shouldShowEditButtons,
		} ),
		new ProductSKUAssessment( {
			urlTitle: createAnchorOpeningTag( options.productSKUUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.productSKUCTAUrl ),
			assessVariants: options.assessVariants,
			addSKULocation: options.addSKULocation,
			shouldShowEditButton: options.shouldShowEditButtons,
		} ),
	];
};

inherits( ProductCornerstoneSEOAssessor, SeoAssessor );

export default ProductCornerstoneSEOAssessor;

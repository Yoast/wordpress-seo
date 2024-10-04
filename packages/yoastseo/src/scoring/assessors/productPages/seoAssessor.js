import SEOAssessor from "../seoAssessor";
import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import TextCompetingLinksAssessment from "../../assessments/seo/TextCompetingLinksAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import ImageKeyphraseAssessment from "../../assessments/seo/KeyphraseInImageTextAssessment.js";
import MetaDescriptionLengthAssessment from "../../assessments/seo/MetaDescriptionLengthAssessment.js";
import SubheadingsKeywordAssessment from "../../assessments/seo/SubHeadingsKeywordAssessment.js";
import TextLengthAssessment from "../../assessments/seo/TextLengthAssessment.js";
import KeyphraseInSEOTitleAssessment from "../../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import PageTitleWidthAssessment from "../../assessments/seo/PageTitleWidthAssessment.js";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment.js";
import SingleH1Assessment from "../../assessments/seo/SingleH1Assessment.js";
import ImageCountAssessment from "../../assessments/seo/ImageCountAssessment.js";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * The ProductSEOAssessor class is used for the SEO analysis for products.
 */
export default class ProductSEOAssessor extends SEOAssessor {
	/**
	 * Creates a new ProductSEOAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "productSEOAssessor";

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
				recommendedMinimum: 200,
				slightlyBelowMinimum: 150,
				belowMinimum: 100,
				veryFarBelowMinimum: 50,
				urlTitle: createAnchorOpeningTag( options.textLengthUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.textLengthCTAUrl ),
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
			new SlugKeywordAssessment( {
				urlTitle: createAnchorOpeningTag( options.urlKeyphraseUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.urlKeyphraseCTAUrl ),
			} ),
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
				urlTitle: createAnchorOpeningTag( options.imageKeyphraseUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.imageKeyphraseCTAUrl ),
			} ),
		];
	}
}

import RelatedKeywordAssessor from "../relatedKeywordAssessor.js";
import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import TextCompetingLinksAssessment from "../../assessments/seo/TextCompetingLinksAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import ImageKeyphraseAssessment from "../../assessments/seo/KeyphraseInImageTextAssessment.js";
import { createAnchorOpeningTag } from "../../../helpers";

/**
 * The ProductRelatedKeywordAssessor class is used for the related keyword analysis for products.
 */
export default class ProductRelatedKeywordAssessor extends RelatedKeywordAssessor {
	/**
	 * Creates a new ProductRelatedKeywordAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "productPageRelatedKeywordAssessor";

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
				isRelatedKeyphrase: true,
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
			new TextCompetingLinksAssessment( {
				urlTitle: createAnchorOpeningTag( options.textCompetingLinksUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.textCompetingLinksCTAUrl ),
			} ),
			new FunctionWordsInKeyphraseAssessment( {
				urlTitle: createAnchorOpeningTag( options.functionWordsInKeyphraseUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.functionWordsInKeyphraseCTAUrl ),
			} ),
			new ImageKeyphraseAssessment( {
				urlTitle: createAnchorOpeningTag( options.imageKeyphraseUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.imageKeyphraseCTAUrl ),
			} ),
		];
	}
}

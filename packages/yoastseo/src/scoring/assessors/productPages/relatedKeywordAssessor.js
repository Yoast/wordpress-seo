import RelatedKeywordAssessor from "../relatedKeywordAssessor.js";
import IntroductionKeywordAssessment from "../../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import TextCompetingLinksAssessment from "../../assessments/seo/TextCompetingLinksAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import ImageKeyphraseAssessment from "../../assessments/seo/KeyphraseInImageTextAssessment.js";
import { createAnchorOpeningTag } from "../../../helpers";
import applyImageScope from "./applyImageScope.js";

/**
 * The ProductRelatedKeywordAssessor class is used for the related keyword analysis for products.
 */
export default class ProductRelatedKeywordAssessor extends RelatedKeywordAssessor {
	/**
	 * Creates a new ProductRelatedKeywordAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 * @param {string}		[options.imageScope]	Which images the image assessments assess: unset for the images in the text, `"productImages"` for the Paper's product images.
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
			new FunctionWordsInKeyphraseAssessment( {
				urlTitle: createAnchorOpeningTag( options.functionWordsInKeyphraseUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.functionWordsInKeyphraseCTAUrl ),
			} ),
			new TextCompetingLinksAssessment( {
				urlTitle: createAnchorOpeningTag( options.textCompetingLinksUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.textCompetingLinksCTAUrl ),
			} ),
			new ImageKeyphraseAssessment( {
				urlTitle: createAnchorOpeningTag( options.imageKeyphraseUrlTitle ),
				urlCallToAction: createAnchorOpeningTag( options.imageKeyphraseCTAUrl ),
			} ),
		];
	}

	/**
	 * Runs the assessments, first propagating the `imageScope` option to the researcher config.
	 *
	 * @param {Paper} paper The paper to run the assessments on.
	 *
	 * @returns {void}
	 */
	assess( paper ) {
		applyImageScope( this._researcher, this._options );
		super.assess( paper );
	}
}

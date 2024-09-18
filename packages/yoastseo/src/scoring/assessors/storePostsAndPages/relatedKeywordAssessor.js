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
 * The StorePostsAndPagesRelatedKeywordAssessor class is used for the related keyword analysis for store posts and pages.
 */
export default class StorePostsAndPagesRelatedKeywordAssessor extends RelatedKeywordAssessor {
	/**
	 * Creates a new StorePostsAndPagesRelatedKeywordAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "storePostsAndPagesRelatedKeywordAssessor";

		this._assessments = [
			new IntroductionKeywordAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify8" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify9" ),
			} ),
			new KeyphraseLengthAssessment( {
				isRelatedKeyphrase: true,
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
			new TextCompetingLinksAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify18" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify19" ),
			} ),
			new FunctionWordsInKeyphraseAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify50" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify51" ),
			} ),
			new ImageKeyphraseAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify22" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify23" ),
			} ),
		];
	}
}

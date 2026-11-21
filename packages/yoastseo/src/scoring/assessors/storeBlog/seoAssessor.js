import SEOAssessor from "../seoAssessor.js";
import KeyphraseLengthAssessment from "../../assessments/seo/KeyphraseLengthAssessment.js";
import MetaDescriptionKeywordAssessment from "../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import MetaDescriptionLengthAssessment from "../../assessments/seo/MetaDescriptionLengthAssessment.js";
import KeyphraseInSEOTitleAssessment from "../../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import PageTitleWidthAssessment from "../../assessments/seo/PageTitleWidthAssessment.js";
import SlugKeywordAssessment from "../../assessments/seo/UrlKeywordAssessment.js";
import FunctionWordsInKeyphraseAssessment from "../../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import { createAnchorOpeningTag } from "../../../helpers/index.js";

/**
 * The StoreBlogSEOAssessor class is used for the SEO analysis for store blogs.
 */
export default class StoreBlogSEOAssessor extends SEOAssessor {
	/**
	 * Creates a new StoreBlogSEOAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "storeBlogSEOAssessor";

		this._assessments = [
			new KeyphraseLengthAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify10" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify11" ),
			} ),
			new MetaDescriptionKeywordAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
			} ),
			new MetaDescriptionLengthAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
			} ),
			new KeyphraseInSEOTitleAssessment( {
				urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify24" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify25" ),
			} ),
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
		];
	}
}

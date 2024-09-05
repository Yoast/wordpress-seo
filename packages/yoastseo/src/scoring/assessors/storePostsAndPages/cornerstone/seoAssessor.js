import StorePostsAndPagesSEOAssessor from "../seoAssessor.js";
import MetaDescriptionLengthAssessment from "../../../assessments/seo/MetaDescriptionLengthAssessment.js";
import TextLengthAssessment from "../../../assessments/seo/TextLengthAssessment.js";
import SlugKeywordAssessment from "../../../assessments/seo/UrlKeywordAssessment.js";
import ImageKeyphraseAssessment from "../../../assessments/seo/KeyphraseInImageTextAssessment";
import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * The StorePostsAndPagesCornerstoneSEOAssessor class is used for the SEO analysis for cornerstone products.
 */
export default class StorePostsAndPagesCornerstoneSEOAssessor extends StorePostsAndPagesSEOAssessor {
	/**
	 * Creates a new StorePostsAndPagesCornerstoneSEOAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "storePostsAndPagesCornerstoneSEOAssessor";

		this.addAssessment( "metaDescriptionLength", new MetaDescriptionLengthAssessment( {
			scores:	{ tooLong: 3, tooShort: 3 },
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify46" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify47" ),
		} ) );
		this.addAssessment( "textLength", new TextLengthAssessment( {
			recommendedMinimum: 900,
			slightlyBelowMinimum: 400,
			belowMinimum: 300,
			scores: { belowMinimum: -20, farBelowMinimum: -20 },
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify58" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify59" ),
			cornerstoneContent: true,
		} ) );
		this.addAssessment( "slugKeyword", new SlugKeywordAssessment( {
			scores: { okay: 3 },
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify26" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify27" ),
		} ) );
		this.addAssessment( "imageKeyphrase", new ImageKeyphraseAssessment( {
			scores: { withAltNonKeyword: 3, withAlt: 3, noAlt: 3 },
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify22" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify23" ),
		} ) );
	}
}

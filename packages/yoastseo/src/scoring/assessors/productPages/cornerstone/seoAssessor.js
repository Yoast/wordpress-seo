import ProductSEOAssessor from "../seoAssessor.js";
import MetaDescriptionLengthAssessment from "../../../assessments/seo/MetaDescriptionLengthAssessment.js";
import TextLengthAssessment from "../../../assessments/seo/TextLengthAssessment.js";
import SlugKeywordAssessment from "../../../assessments/seo/UrlKeywordAssessment.js";
import ImageKeyphraseAssessment from "../../../assessments/seo/KeyphraseInImageTextAssessment.js";

import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * The ProductCornerstoneSEOAssessor class is used for the SEO analysis for cornerstone products.
 */
export default class ProductCornerstoneSEOAssessor extends ProductSEOAssessor {
	/**
	 * Creates a new ProductCornerstoneSEOAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "productCornerstoneSEOAssessor";

		this.addAssessment( "metaDescriptionLength", new MetaDescriptionLengthAssessment( {
			scores:	{ tooLong: 3, tooShort: 3 },
			urlTitle: createAnchorOpeningTag( options.metaDescriptionLengthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.metaDescriptionLengthCTAUrl ),
		} ) );
		this.addAssessment( "textLength", new TextLengthAssessment( {
			recommendedMinimum: 400,
			slightlyBelowMinimum: 300,
			belowMinimum: 200,
			scores: { belowMinimum: -20, farBelowMinimum: -20 },
			urlTitle: createAnchorOpeningTag( options.textLengthUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.textLengthCTAUrl ),
			cornerstoneContent: true,
			customContentType: this.type,
		} ) );
		this.addAssessment( "slugKeyword", new SlugKeywordAssessment( {
			scores: { okay: 3 },
			urlTitle: createAnchorOpeningTag( options.urlKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.urlKeyphraseCTAUrl ),
		} ) );
		this.addAssessment( "imageKeyphrase", new ImageKeyphraseAssessment( {
			scores: { withAltNonKeyword: 3, withAlt: 3, noAlt: 3 },
			urlTitle: createAnchorOpeningTag( options.imageKeyphraseUrlTitle ),
			urlCallToAction: createAnchorOpeningTag( options.imageKeyphraseCTAUrl ),
		} ) );
	}
}

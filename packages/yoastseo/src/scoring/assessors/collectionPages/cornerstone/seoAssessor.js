import CollectionSEOAssessor from "../seoAssessor";
import TextLengthAssessment from "../../../assessments/seo/TextLengthAssessment.js";
import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * The CollectionCornerstoneSEOAssessor class is used for the SEO analysis for cornerstone collections.
 */
export default class CollectionCornerstoneSEOAssessor extends CollectionSEOAssessor {
	/**
	 * Creates a new CollectionCornerstoneSEOAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "collectionCornerstoneSEOAssessor";

		this.addAssessment( "textLength", new TextLengthAssessment( {
			recommendedMinimum: 30,
			slightlyBelowMinimum: 10,
			veryFarBelowMinimum: 1,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify58" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify59" ),
			cornerstoneContent: true,
			customContentType: this.type,
		} ) );
	}
}

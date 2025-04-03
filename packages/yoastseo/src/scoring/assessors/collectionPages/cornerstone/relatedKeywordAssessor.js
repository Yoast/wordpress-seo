import CollectionRelatedKeywordAssessor from "../relatedKeywordAssessor.js";
import MetaDescriptionKeywordAssessment from "../../../assessments/seo/MetaDescriptionKeywordAssessment.js";
import { createAnchorOpeningTag } from "../../../../helpers";

/**
 * The CollectionCornerstoneRelatedKeywordAssessor class is used for the related keyword analysis for cornerstone collections.
 */
export default class CollectionCornerstoneRelatedKeywordAssessor extends CollectionRelatedKeywordAssessor {
	/**
	 * Creates a new CollectionCornerstoneRelatedKeywordAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "collectionRelatedKeywordAssessor";

		this.addAssessment( "metaDescriptionKeyword", new MetaDescriptionKeywordAssessment( {
			parameters: { recommendedMinimum: 1 }, scores: { good: 9, bad: 3 },
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify14" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify15" ),
		} ) );
	}
}

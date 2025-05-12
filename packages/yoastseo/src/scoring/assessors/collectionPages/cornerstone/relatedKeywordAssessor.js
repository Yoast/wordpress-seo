import CollectionRelatedKeywordAssessor from "../relatedKeywordAssessor.js";

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
	}
}

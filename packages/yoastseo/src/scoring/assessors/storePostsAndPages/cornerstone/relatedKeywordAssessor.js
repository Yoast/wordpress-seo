import StorePostsAndPagesRelatedKeywordAssessor from "../relatedKeywordAssessor";

/**
 * The StorePostsAndPagesCornerstoneRelatedKeywordAssessor class is used for the related keyword analysis for cornerstone posts and pages.
 */
export default class StorePostsAndPagesCornerstoneRelatedKeywordAssessor extends StorePostsAndPagesRelatedKeywordAssessor {
	/**
	 * Creates a new StorePostsAndPagesCornerstoneRelatedKeywordAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "storePostsAndPagesCornerstoneRelatedKeywordAssessor";
	}
}

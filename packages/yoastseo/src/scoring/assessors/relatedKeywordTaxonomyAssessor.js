import RelatedKeywordAssessor from "./relatedKeywordAssessor.js";

/**
 * The RelatedKeywordTaxonomyAssessor class is used for the related keyword analysis on terms.
 */
export default class RelatedKeywordTaxonomyAssessor extends RelatedKeywordAssessor {
	/**
	 * Creates a new RelatedKeywordTaxonomyAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "relatedKeywordsTaxonomyAssessor";

		this.removeAssessment( "textCompetingLinks" );
		this.removeAssessment( "imageKeyphrase" );
	}
}

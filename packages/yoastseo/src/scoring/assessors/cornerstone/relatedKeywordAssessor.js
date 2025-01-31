import RelatedKeywordAssessor from "../relatedKeywordAssessor";
import KeyphraseInImagesAssessment from "../../assessments/seo/KeyphraseInImageTextAssessment";

/**
 * The CornerstoneRelatedKeywordAssessor class is used for the related keyword analysis for cornerstone content.
 */
export default class CornerstoneRelatedKeywordAssessor extends RelatedKeywordAssessor {
	/**
	 * Creates a new CornerstoneRelatedKeywordAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "cornerstoneRelatedKeywordAssessor";

		this.addAssessment( "imageKeyphrase", new KeyphraseInImagesAssessment( {
			scores: { withAltNonKeyword: 3, withAlt: 3, noAlt: 3 },
		} ) );
	}
}

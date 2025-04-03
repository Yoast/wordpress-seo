import Assessor from "./assessor";

import PageTitleWidthAssessment from "../assessments/seo/PageTitleWidthAssessment";
import KeyphraseInSEOTitleAssessment from "../assessments/seo/KeyphraseInSEOTitleAssessment";

/**
 * The Assessor class that is used for the assessment of the SEO title.
 */
export default class SeoTitleAssessor extends Assessor {
	/**
	 * Creates a new SeoTitleAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "seoTitleAssessor";

		this._assessments = [
			new PageTitleWidthAssessment(),
			new KeyphraseInSEOTitleAssessment(),
		];
	}
}

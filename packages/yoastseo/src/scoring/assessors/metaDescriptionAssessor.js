import Assessor from "./assessor.js";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment.js";
import MetaDescriptionLength from "../assessments/seo/MetaDescriptionLengthAssessment.js";

/**
 * The Assessor class that is used for the assessment of the meta description.
 */
export default class MetaDescriptionAssessor extends Assessor {
	/**
	 * Creates a new MetaDescriptionAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "metaDescriptionAssessor";

		this._assessments = [
			new MetaDescriptionKeywordAssessment(),
			new MetaDescriptionLength(),
		];
	}
}

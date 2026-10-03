import Assessor from "./assessor";

import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseDensityAssessment from "../assessments/seo/KeywordDensityAssessment";
import SubheadingsKeyword from "../assessments/seo/SubHeadingsKeywordAssessment";
import ImageKeyphrase from "../assessments/seo/KeyphraseInImageTextAssessment";

/**
 * The Assessor class that is used for the assessments of the keyphrase use.
 */
export default class KeyphraseUseAssessor extends Assessor {
	/**
	 * Creates a new KeyphraseUseAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "keyphraseUseAssessor";

		this._assessments = [
			new IntroductionKeywordAssessment(),
			new KeyphraseDensityAssessment(),
			new SubheadingsKeyword(),
			new ImageKeyphrase(),
		];
	}
}

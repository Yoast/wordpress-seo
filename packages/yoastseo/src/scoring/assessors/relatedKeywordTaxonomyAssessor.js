import Assessor from "./assessor.js";
import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment.js";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment.js";

/**
 * The RelatedKeywordTaxonomyAssessor class is used for the related keyword analysis on terms.
 */
export default class RelatedKeywordTaxonomyAssessor extends Assessor {
	/**
	 * Creates a new RelatedKeywordTaxonomyAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "relatedKeywordsTaxonomyAssessor";

		this._assessments = [
			new IntroductionKeywordAssessment(),
			new KeyphraseLengthAssessment( { isRelatedKeyphrase: true } ),
			new KeyphraseDensityAssessment(),
			new MetaDescriptionKeywordAssessment(),
			// Text Images assessment here.
			new FunctionWordsInKeyphrase(),
		];
	}
}

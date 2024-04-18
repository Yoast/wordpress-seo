import Assessor from "./assessor";
import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeyphraseDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import FunctionWordsInKeyphrase from "./assessments/seo/FunctionWordsInKeyphraseAssessment";

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

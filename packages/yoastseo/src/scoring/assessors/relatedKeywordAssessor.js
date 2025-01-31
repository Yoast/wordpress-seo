import Assessor from "./assessor.js";
import IntroductionKeyword from "../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLength from "../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeyword from "../assessments/seo/MetaDescriptionKeywordAssessment.js";
import TextCompetingLinks from "../assessments/seo/TextCompetingLinksAssessment.js";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment";
import ImageKeyphrase from "../assessments/seo/KeyphraseInImageTextAssessment";

/**
 * The relatedKeywordAssessor class is used for the related keyword analysis.
 */
export default class RelatedKeywordAssessor extends Assessor {
	/**
	 * Creates a new RelatedKeywordAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "relatedKeywordAssessor";

		this._assessments = [
			new IntroductionKeyword(),
			new KeyphraseLength( { isRelatedKeyphrase: true } ),
			new KeyphraseDensityAssessment(),
			new MetaDescriptionKeyword(),
			new TextCompetingLinks(),
			new FunctionWordsInKeyphrase(),
			new ImageKeyphrase(),
		];
	}
}

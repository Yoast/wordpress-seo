import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeyphraseDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import KeyphraseInSEOTitleAssessment from "./assessments/seo/KeyphraseInSEOTitleAssessment";
import SlugKeywordAssessment from "./assessments/seo/UrlKeywordAssessment";
import Assessor from "./assessor";
import MetaDescriptionLengthAssessment from "./assessments/seo/MetaDescriptionLengthAssessment";
import TextLengthAssessment from "./assessments/seo/TextLengthAssessment";
import PageTitleWidthAssessment from "./assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "./assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "./assessments/seo/SingleH1Assessment";
import { createAnchorOpeningTag } from "../helpers";

/**
 * Returns the text length assessment to use.
 *
 * @returns {TextLengthAssessment} The text length assessment (with taxonomy configuration) to use.
 */
export const getTextLengthAssessment = function() {
	// Export so it can be used in tests.
	return new TextLengthAssessment( {
		recommendedMinimum: 30,
		slightlyBelowMinimum: 10,
		veryFarBelowMinimum: 1,
		urlTitle: createAnchorOpeningTag( "https://yoa.st/34j" ),
		urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34k" ),
		customContentType: "taxonomyAssessor",
	} );
};

/**
 * Creates the Assessor used for taxonomy pages.
 */
class TaxonomyAssessor extends Assessor {
	/**
	 * Creates a new taxonomy assessor.
	 *
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		options		The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );

		this.type = "taxonomyAssessor";

		this._assessments = [
			new IntroductionKeywordAssessment(),
			new KeyphraseLengthAssessment(),
			new KeyphraseDensityAssessment(),
			new MetaDescriptionKeywordAssessment(),
			new MetaDescriptionLengthAssessment(),
			getTextLengthAssessment(),
			new KeyphraseInSEOTitleAssessment(),
			new PageTitleWidthAssessment(
				{
					scores: {
						widthTooShort: 9,
					},
				}, true
			),
			new SlugKeywordAssessment(),
			new FunctionWordsInKeyphrase(),
			new SingleH1Assessment(),
		];
	}
}

export default TaxonomyAssessor;

import Assessor from "./assessor.js";
import IntroductionKeywordAssessment from "../assessments/seo/IntroductionKeywordAssessment.js";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment.js";
import KeyphraseDensityAssessment from "../assessments/seo/KeywordDensityAssessment.js";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment.js";
import KeyphraseInSEOTitleAssessment from "../assessments/seo/KeyphraseInSEOTitleAssessment.js";
import SlugKeywordAssessment from "../assessments/seo/UrlKeywordAssessment.js";
import MetaDescriptionLengthAssessment from "../assessments/seo/MetaDescriptionLengthAssessment.js";
import TextLengthAssessment from "../assessments/seo/TextLengthAssessment.js";
import PageTitleWidthAssessment from "../assessments/seo/PageTitleWidthAssessment.js";
import FunctionWordsInKeyphrase from "../assessments/seo/FunctionWordsInKeyphraseAssessment.js";
import SingleH1Assessment from "../assessments/seo/SingleH1Assessment.js";
import { createAnchorOpeningTag } from "../../helpers";

/**
 * Returns the text length assessment to use.
 *
 * @returns {TextLengthAssessment} The text length assessment (with taxonomy configuration) to use.
 */
export const getTextLengthAssessment = () => {
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
 * The TaxonomyAssessor is used for the assessment of terms.
 */
export default class TaxonomyAssessor extends Assessor {
	/**
	 * Creates a new TaxonomyAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
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

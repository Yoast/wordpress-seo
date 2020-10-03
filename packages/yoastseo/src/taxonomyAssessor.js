import { inherits } from "util";

import IntroductionKeywordAssessment from "./scoring/assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./scoring/assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./scoring/assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./scoring/assessments/seo/MetaDescriptionKeywordAssessment";
import TitleKeywordAssessment from "./scoring/assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./scoring/assessments/seo/UrlKeywordAssessment";
import Assessor from "./assessor";
import MetaDescriptionLengthAssessment from "./scoring/assessments/seo/MetaDescriptionLengthAssessment";
import TextLengthAssessment from "./scoring/assessments/seo/TextLengthAssessment";
import PageTitleWidthAssessment from "./scoring/assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "./scoring/assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "./scoring/assessments/seo/SingleH1Assessment";
import { createAnchorOpeningTag } from "./helpers/shortlinker";

/**
 * Returns the text length assessment to use.
 *
 * @returns {TextLengthAssessment} The text length assessment (with taxonomy configuration) to use.
 */
export const getTextLengthAssessment = function() {
	// Export so it can be used in tests.
	return new TextLengthAssessment( {
		recommendedMinimum: 250,
		slightlyBelowMinimum: 200,
		belowMinimum: 100,
		veryFarBelowMinimum: 50,
		urlTitle: createAnchorOpeningTag( "https://yoa.st/34j" ),
		urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34k" ),
	} );
};

/**
 * Creates the Assessor used for taxonomy pages.
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @constructor
 */
const TaxonomyAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );
	this.type = "TaxonomyAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLengthAssessment(),
		getTextLengthAssessment(),
		new TitleKeywordAssessment(),
		new PageTitleWidthAssessment(),
		new UrlKeywordAssessment(),
		new FunctionWordsInKeyphrase(),
		new SingleH1Assessment(),
	];
};

inherits( TaxonomyAssessor, Assessor );

export default TaxonomyAssessor;

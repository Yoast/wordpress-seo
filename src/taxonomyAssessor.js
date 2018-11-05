import { inherits } from "util";

import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import TitleKeywordAssessment from "./assessments/seo/TitleKeywordAssessment";
import taxonomyTextLengthAssessment from "./assessments/seo/taxonomyTextLengthAssessment";
import UrlKeywordAssessment from "./assessments/seo/UrlKeywordAssessment";
import Assessor from "./assessor";
import MetaDescriptionLengthAssessment from "./assessments/seo/MetaDescriptionLengthAssessment";
import TextLengthAssessment from "./assessments/seo/TextLengthAssessment";
import PageTitleWidthAssessment from "./assessments/seo/PageTitleWidthAssessment";
import UrlLengthAssessment from "./assessments/seo/UrlLengthAssessment";
import urlStopWordsAssessment from "./assessments/seo/urlStopWordsAssessment";
import FunctionWordsInKeyphrase from "./assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "./assessments/seo/SingleH1Assessment";
import { createAnchorOpeningTag } from "./helpers/shortlinker";

/**
 * Returns the text length assessment to use, based on whether recalibration has been
 * activated or not.
 *
 * @param {boolean} useRecalibration If the recalibration assessment should be used or not.
 * @returns {Object} The text length assessment to use.
 */
export const getTextLengthAssessment = function( useRecalibration ) {
	// Export so it can be used in tests.
	if ( useRecalibration ) {
		return new TextLengthAssessment( {
			recommendedMinimum: 250,
			slightlyBelowMinimum: 200,
			belowMinimum: 100,
			veryFarBelowMinimum: 50,
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34j" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34k" ),
		} );
	}
	return taxonomyTextLengthAssessment;
};

/**
 * Creates the Assessor used for taxonomy pages.
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
const TaxonomyAssessor = function( i18n ) {
	Assessor.call( this, i18n );
	this.type = "TaxonomyAssessor";

	// Get the text length boundaries (they are different for recalibration).
	const textLengthAssessment = getTextLengthAssessment( process.env.YOAST_RECALIBRATION === "enabled" );

	if ( process.env.YOAST_RECALIBRATION === "enabled" ) {
		this._assessments = [
			new IntroductionKeywordAssessment(),
			new KeyphraseLengthAssessment(),
			new KeywordDensityAssessment(),
			new MetaDescriptionKeywordAssessment(),
			new MetaDescriptionLengthAssessment(),
			textLengthAssessment,
			new TitleKeywordAssessment(),
			new PageTitleWidthAssessment(),
			new UrlKeywordAssessment(),
			new FunctionWordsInKeyphrase(),
			new SingleH1Assessment(),
		];
	} else {
		this._assessments = [
			new IntroductionKeywordAssessment(),
			new KeyphraseLengthAssessment(),
			new KeywordDensityAssessment(),
			new MetaDescriptionKeywordAssessment(),
			new MetaDescriptionLengthAssessment(),
			textLengthAssessment,
			new TitleKeywordAssessment(),
			new PageTitleWidthAssessment(),
			new UrlKeywordAssessment(),
			new UrlLengthAssessment(),
			urlStopWordsAssessment,
			new FunctionWordsInKeyphrase(),
		];
	}
};

inherits( TaxonomyAssessor, Assessor );

export default TaxonomyAssessor;

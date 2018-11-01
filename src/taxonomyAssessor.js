import { inherits } from "util";

import IntroductionKeywordAssessment from "./assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./assessments/seo/MetaDescriptionKeywordAssessment";
import TitleKeywordAssessment from "./assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./assessments/seo/UrlKeywordAssessment";
import Assessor from "./assessor";
import MetaDescriptionLengthAssessment from "./assessments/seo/MetaDescriptionLengthAssessment";
import TextLengthAssessment from "./assessments/seo/TextLengthAssessment";
import PageTitleWidthAssessment from "./assessments/seo/PageTitleWidthAssessment";
import UrlLengthAssessment from "./assessments/seo/UrlLengthAssessment";
import urlStopWordsAssessment from "./assessments/seo/urlStopWordsAssessment";
import FunctionWordsInKeyphrase from "./assessments/seo/FunctionWordsInKeyphraseAssessment";

/**
 * Returns the boundaries to use for the text length assessment.
 *
 * @param {boolean} useRecalibration If the recalibration boundaries should be used or not.
 * @returns {Object} The text length assessment boundaries to use.
 */
const getTextLengthBoundaries = function( useRecalibration ) {
	if ( useRecalibration ) {
		return {
			recommendedMinimum: 250,
			slightlyBelowMinimum: 200,
			belowMinimum: 100,
			veryFarBelowMinimum: 50,
		};
	}
	return {
		recommendedMinimum: 150,
		slightlyBelowMinimum: 125,
		belowMinimum: 100,
		veryFarBelowMinimum: 50,
	};
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
	const textLengthBoundaries = getTextLengthBoundaries( process.env.YOAST_RECALIBRATION === "enabled" );

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLengthAssessment(),
		new TextLengthAssessment( textLengthBoundaries ),
		new TitleKeywordAssessment(),
		new PageTitleWidthAssessment(),
		new UrlKeywordAssessment(),
		new UrlLengthAssessment(),
		urlStopWordsAssessment,
		new FunctionWordsInKeyphrase(),
	];
};

inherits( TaxonomyAssessor, Assessor );

export default TaxonomyAssessor;

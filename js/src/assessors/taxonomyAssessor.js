import {
	Assessor,
	assessments,
} from "yoastseo";

const {
	IntroductionKeywordAssessment,
	KeyphraseLengthAssessment,
	KeywordDensityAssessment,
	KeywordStopWordsAssessment,
	MetaDescriptionKeywordAssessment,
	MetaDescriptionLengthAssessment,
	TitleKeywordAssessment,
	PageTitleWidthAssessment,
	UrlKeywordAssessment,
	UrlLengthAssessment,
	UrlStopWordsAssessment,
	TaxonomyTextLengthAssessment,
} = assessments.seo;

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var TaxonomyAssessor = function( i18n ) {
	Assessor.call( this, i18n );

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		KeywordStopWordsAssessment,
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLengthAssessment(),
		TaxonomyTextLengthAssessment,
		new TitleKeywordAssessment(),
		new PageTitleWidthAssessment(),
		new UrlKeywordAssessment(),
		new UrlLengthAssessment(),
		UrlStopWordsAssessment,
	];
};

module.exports = TaxonomyAssessor;

require( "util" ).inherits( module.exports, Assessor );

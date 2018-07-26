import {
	Assessor,
	assessments,
} from "yoastseo";

const {
	IntroductionKeyword,
	KeyphraseLength,
	KeywordDensity,
	KeywordStopWords,
	MetaDescriptionKeyword,
	MetaDescriptionLength,
	TitleKeyword,
	PageTitleWidth,
	UrlKeyword,
	UrlLength,
	UrlStopWords,
	TaxonomyTextLength,
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
		IntroductionKeyword,
		KeyphraseLength,
		KeywordDensity,
		KeywordStopWords,
		MetaDescriptionKeyword,
		new MetaDescriptionLength(),
		TaxonomyTextLength,
		TitleKeyword,
		new PageTitleWidth(),
		new UrlKeyword(),
		new UrlLength(),
		UrlStopWords,
	];
};

module.exports = TaxonomyAssessor;

require( "util" ).inherits( module.exports, Assessor );


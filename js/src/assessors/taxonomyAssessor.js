var Assessor = require( "yoastseo/js/assessor.js" );

var introductionKeyword = require( "yoastseo/js/assessments/seo/introductionKeywordAssessment.js" );
var keyphraseLength = require( "yoastseo/js/assessments/seo/keyphraseLengthAssessment.js" );
var keywordDensity = require( "yoastseo/js/assessments/seo/keywordDensityAssessment.js" );
var keywordStopWords = require( "yoastseo/js/assessments/seo/keywordStopWordsAssessment.js" );
var metaDescriptionKeyword = require( "yoastseo/js/assessments/seo/metaDescriptionKeywordAssessment.js" );
var MetaDescriptionLength = require( "yoastseo/js/assessments/seo/metaDescriptionLengthAssessment.js" );
var titleKeyword = require( "yoastseo/js/assessments/seo/titleKeywordAssessment.js" );
var TitleWidth = require( "yoastseo/js/assessments/seo/pageTitleWidthAssessment.js" );
var UrlKeyword = require( "yoastseo/js/assessments/seo/urlKeywordAssessment.js" );
var UrlLength = require( "yoastseo/js/assessments/seo/urlLengthAssessment.js" );
var urlStopWords = require( "yoastseo/js/assessments/seo/urlStopWordsAssessment.js" );
var TextLength = require( "yoastseo/js/assessments/seo/textLengthAssessment.js" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var TaxonomyAssessor = function( i18n ) {
	Assessor.call( this, i18n );

	this._assessments = [
		introductionKeyword,
		keyphraseLength,
		keywordDensity,
		keywordStopWords,
		metaDescriptionKeyword,
		new MetaDescriptionLength(),
		titleKeyword,
		new TitleWidth(),
		new UrlKeyword(),
		new UrlLength(),
		urlStopWords,
		new TextLength( {
			recommendedMinimum: 250,
			slightlyBelowMinimum: 200,
			belowMinimum: 150,
			veryFarBelowMinimum: 100,
		} ),
	];
};

module.exports = TaxonomyAssessor;

require( "util" ).inherits( module.exports, Assessor );

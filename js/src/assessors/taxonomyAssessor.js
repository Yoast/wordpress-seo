var Assessor = require( "yoastseo/js/assessor.js" );

var introductionKeyword = require( "yoastseo/js/assessments/seo/introductionKeywordAssessment.js" );
var keyphraseLength = require( "yoastseo/js/assessments/seo/keyphraseLengthAssessment.js" );
var keywordDensity = require( "yoastseo/js/assessments/seo/keywordDensityAssessment.js" );
var keywordStopWords = require( "yoastseo/js/assessments/seo/keywordStopWordsAssessment.js" );
var metaDescriptionKeyword = require( "yoastseo/js/assessments/seo/metaDescriptionKeywordAssessment.js" );
var metaDescriptionLength = require( "yoastseo/js/assessments/seo/metaDescriptionLengthAssessment.js" );
var titleKeyword = require( "yoastseo/js/assessments/seo/titleKeywordAssessment.js" );
var titleWidth = require( "yoastseo/js/assessments/seo/pageTitleWidthAssessment.js" );
var urlKeyword = require( "yoastseo/js/assessments/seo/urlKeywordAssessment.js" );
var urlLength = require( "yoastseo/js/assessments/seo/urlLengthAssessment.js" );
var urlStopWords = require( "yoastseo/js/assessments/seo/urlStopWordsAssessment.js" );
var taxonomyTextLength = require( "yoastseo/js/assessments/seo/taxonomyTextLengthAssessment" );

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
		metaDescriptionLength,
		taxonomyTextLength,
		titleKeyword,
		titleWidth,
		urlKeyword,
		urlLength,
		urlStopWords,
	];
};

module.exports = TaxonomyAssessor;

require( "util" ).inherits( module.exports, Assessor );


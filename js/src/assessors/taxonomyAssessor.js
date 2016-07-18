var Assessor = require( "yoastseo/js/assessor.js" );

var introductionKeyword = require( "yoastseo/js/assessments/introductionKeywordAssessment.js" );
var keyphraseLength = require( "yoastseo/js/assessments/keyphraseLengthAssessment.js" );
var keywordDensity = require( "yoastseo/js/assessments/keywordDensityAssessment.js" );
var keywordStopWords = require( "yoastseo/js/assessments/keywordStopWordsAssessment.js" );
var metaDescriptionKeyword = require ( "yoastseo/js/assessments/metaDescriptionKeywordAssessment.js" );
var metaDescriptionLength = require( "yoastseo/js/assessments/metaDescriptionLengthAssessment.js" );
var titleKeyword = require( "yoastseo/js/assessments/titleKeywordAssessment.js" );
var titleLength = require( "yoastseo/js/assessments/titleLengthAssessment.js" );
var urlKeyword = require( "yoastseo/js/assessments/urlKeywordAssessment.js" );
var urlLength = require( "yoastseo/js/assessments/urlLengthAssessment.js" );
var urlStopWords = require( "yoastseo/js/assessments/urlStopWordsAssessment.js" );
var taxonomyTextLength = require( 'yoastseo/js/assessments/taxonomyTextLengthAssessment' );

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
		titleLength,
		urlKeyword,
		urlLength,
		urlStopWords
	];
};

module.exports = TaxonomyAssessor;

require( "util" ).inherits( module.exports, Assessor );


var Assessor = require( "./assessor.js" );

var introductionKeyword = require( "./assessments/introductionKeywordAssessment.js" );
var keyphraseLength = require( "./assessments/keyphraseLengthAssessment.js" );
var keywordDensity = require( "./assessments/keywordDensityAssessment.js" );
var keywordStopWords = require( "./assessments/keywordStopWordsAssessment.js" );
var metaDescriptionKeyword = require ( "./assessments/metaDescriptionKeywordAssessment.js" );
var metaDescriptionLength = require( "./assessments/metaDescriptionLengthAssessment.js" );
var subheadingsKeyword = require( "./assessments/subheadingsKeywordAssessment.js" );
var textCompetingLinks = require( "./assessments/textCompetingLinksAssessment.js" );
var textImages = require( "./assessments/textImagesAssessment.js" );
var textLength = require( "./assessments/textLengthAssessment.js" );
var textLinks = require( "./assessments/textLinksAssessment.js" );
var textSubheadings = require( "./assessments/textSubheadingsAssessment.js" );
var titleKeyword = require( "./assessments/titleKeywordAssessment.js" );
var titleLength = require( "./assessments/titleLengthAssessment.js" );
var urlKeyword = require( "./assessments/urlKeywordAssessment.js" );
var urlLength = require( "./assessments/urlLengthAssessment.js" );
var urlStopWords = require( "./assessments/urlStopWordsAssessment.js" );
/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var SEOAssessor = function( i18n ) {
	Assessor.call( this, i18n );

	this._assessments = {
		introductionKeyword:    introductionKeyword,
		keyphraseLength:        keyphraseLength,
		keywordDensity:         keywordDensity,
		keywordStopWords:       keywordStopWords,
		metaDescriptionKeyword: metaDescriptionKeyword,
		metaDescriptionLength:  metaDescriptionLength,
		subheadingsKeyword:     subheadingsKeyword,
		textCompetingLinks:     textCompetingLinks,
		textImages:             textImages,
		textLength:             textLength,
		textLinks:              textLinks,
		textSubheadings:        textSubheadings,
		titleKeyword:           titleKeyword,
		titleLength:            titleLength,
		urlKeyword:             urlKeyword,
		urlLength:              urlLength,
		urlStopWords:           urlStopWords
	};
};

module.exports = SEOAssessor;

require( "util" ).inherits( module.exports, Assessor );


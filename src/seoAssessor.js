var Assessor = require( "./assessor.js" );

var introductionKeyword = require( "./assessments/seo/introductionKeywordAssessment.js" );
var keyphraseLength = require( "./assessments/seo/keyphraseLengthAssessment.js" );
var KeywordDensity = require( "./assessments/seo/keywordDensityAssessment.js" );
var keywordStopWords = require( "./assessments/seo/keywordStopWordsAssessment.js" );
var metaDescriptionKeyword = require( "./assessments/seo/metaDescriptionKeywordAssessment.js" );
var MetaDescriptionLength = require( "./assessments/seo/metaDescriptionLengthAssessment.js" );
var SubheadingsKeyword = require( "./assessments/seo/subheadingsKeywordAssessment.js" );
var textCompetingLinks = require( "./assessments/seo/textCompetingLinksAssessment.js" );
var TextImages = require( "./assessments/seo/textImagesAssessment.js" );
var TextLength = require( "./assessments/seo/textLengthAssessment.js" );
var OutboundLinks = require( "./assessments/seo/outboundLinksAssessment.js" );
var internalLinks = require( "./assessments/seo/internalLinksAssessment" );
var titleKeyword = require( "./assessments/seo/titleKeywordAssessment.js" );
var TitleWidth = require( "./assessments/seo/pageTitleWidthAssessment.js" );
var UrlKeyword = require( "./assessments/seo/urlKeywordAssessment.js" );
var UrlLength = require( "./assessments/seo/urlLengthAssessment.js" );
var urlStopWords = require( "./assessments/seo/urlStopWordsAssessment.js" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var SEOAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		introductionKeyword,
		keyphraseLength,
		new KeywordDensity(),
		keywordStopWords,
		metaDescriptionKeyword,
		new MetaDescriptionLength(),
		new SubheadingsKeyword(),
		textCompetingLinks,
		new TextImages(),
		new TextLength(),
		new OutboundLinks(),
		internalLinks,
		titleKeyword,
		new TitleWidth(),
		new UrlKeyword(),
		new UrlLength(),
		urlStopWords,
	];
};

require( "util" ).inherits( SEOAssessor, Assessor );

module.exports = SEOAssessor;

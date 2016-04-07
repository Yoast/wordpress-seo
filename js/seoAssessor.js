var Assessor = require( "./assessor.js" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var SEOAssessor = function( i18n ) {
	Assessor.call(this, i18n);

	this._assessments = {
		fleschReadingEase: require( "./assessments/fleschReadingEaseAssessment.js" ),
		introductionKeyword: require( "./assessments/introductionKeywordAssessment.js" ),
		keyphraseLength: require( "./assessments/keyphraseLengthAssessment.js" ),
		keywordDensity: require( "./assessments/keywordDensityAssessment.js" ),
		keywordStopWords: require( "./assessments/keywordStopWordsAssessment.js" ),
		metaDescriptionKeyword: require ( "./assessments/metaDescriptionKeywordAssessment.js" ),
		metaDescriptionLength: require( "./assessments/metaDescriptionLengthAssessment.js" ),
		subheadingsKeyword: require( "./assessments/subheadingsKeywordAssessment.js" ),
		textCompetingLinks: require( "./assessments/textCompetingLinksAssessment.js" ),
		textImages: require( "./assessments/textImagesAssessment.js" ),
		textLength: require( "./assessments/textLengthAssessment.js" ),
		textLinks: require( "./assessments/textLinksAssessment.js" ),
		textSubheadings: require( "./assessments/textSubheadingsAssessment.js" ),
		titleKeyword: require( "./assessments/titleKeywordAssessment.js" ),
		titleLength: require( "./assessments/titleLengthAssessment.js" ),
		urlKeyword: require( "./assessments/urlKeywordAssessment.js" ),
		urlLength: require( "./assessments/urlLengthAssessment.js" ),
		urlStopWords: require( "./assessments/urlStopWordsAssessment.js" )
	};
};

module.exports = SEOAssessor;

require( "util" ).inherits( module.exports, Assessor );


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
		wordCount: require( "./assessments/countWords.js" ),
		urlLength: require( "./assessments/urlIsTooLong.js" ),
		fleschReading: require( "./assessments/calculateFleschReading.js" ),
		linkCount: require( "./assessments/countLinks.js" ),
		getLinkStatistics: require( "./assessments/getLinkStatistics.js" ),
		pageTitleKeyword: require( "./assessments/pageTitleKeyword.js" ),
		subHeadings: require( "./assessments/matchKeywordInSubheading.js" ),
		matchSubheadings: require( "./assessments/matchSubheadings.js" ),
		keywordDensity: require( "./assessments/keywordDensity.js" ),
		stopwordKeywordCount: require( "./assessments/stopWordsInKeyword.js" ),
		urlStopwords: require( "./assessments/stopWordsInUrl.js" ),
		metaDescriptionLength: require( "./assessments/metaDescriptionLength.js" ),
		keyphraseSizeCheck: require( "./assessments/keyphraseLength.js" ),
		metaDescriptionKeyword: require ( "./assessments/metaDescriptionKeyword.js" ),
		imageCount: require( "./assessments/imageCount.js" ),
		urlKeyword: require( "./assessments/keywordInUrl.js" ),
		firstParagraph: require( "./assessments/firstParagraph.js" ),
		pageTitleLength: require( "./assessments/pageTitleLength.js" )
	};
};

module.exports = SEOAssessor;

require( "util" ).inherits( module.exports, Assessor );


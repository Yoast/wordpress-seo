// var researcher = require( "./researcher.js" );
var Paper = require( "./values/Paper.js" );

// var merge = require( "lodash/object/merge" );

var InvalidTypeError = require( "./errors/invalidType" );

// var MissingArgument = require( "./errors/missingArgument" );
// var isUndefined = require( "lodash/lang/isUndefined" );
// var isEmpty = require( "lodash/lang/isEmpty" );

//assessments

var assessments = {};
assessments.wordCount = require( "./assessments/countWords.js" );
assessments.urlLength = require( "./assessments/urlIsTooLong.js" );
assessments.fleschReading = require( "./assessments/calculateFleschReading.js" );
assessments.linkCount = require( "./assessments/getLinkStatistics.js" );
assessments.pageTitleKeyword = require( "./assessments/pageTitleKeyword.js" );
assessments.subHeadings = require( "./assessments/matchKeywordInSubheading.js" );
assessments.keywordDensity = require( "./assessments/keywordDensity.js" );
assessments.stopwordKeywordCount = require( "./assessments/stopWordsInKeyword.js" );
assessments.urlStopwords = require( "./assessments/stopWordsInUrl.js" );
assessments.metaDescriptionLength = require( "./assessments/metaDescriptionLength.js" );
assessments.keyphraseSizeCheck = require( "./assessments/keyphraseLength.js" );
assessments.metaDescriptionKeyword = require ( "./assessments/metaDescriptionKeyword.js" );
assessments.imageCount = require( "./assessments/imageCount.js" );
assessments.urlKeyword = require( "./assessments/keywordInUrl.js" );
assessments.firstParagraph = require( "./assessments/firstParagraph.js" );
assessments.pageTitleLength = require( "./assessments/pageTitleLength.js" );

/**
 * Creates the Assessor
 *
 * @param {Paper} paper the paper to be used for running assessments.
 * @constructor
 */
var Assessor = function( paper ) {
	this.setPaper( paper );

	// this.researcher = new researcher( paper );

	// this.taskList = [];
};

/**
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 * @param paper
 */
Assessor.prototype.setPaper = function( paper ) {
	if ( !( paper instanceof Paper ) ) {
		throw new InvalidTypeError( "The assessor requires an Paper object." );
	}
	this.paper = paper;
};

/**
 * Gets all available assessments.
 * @returns {{}}
 */
Assessor.prototype.getAvailableAssessments = function() {
	return assessments;
};

Assessor.prototype.outputScore = function() {

};

module.exports = Assessor;
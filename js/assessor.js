var Researcher = require( "./researcher.js" );
var Paper = require( "./values/Paper.js" );

var InvalidTypeError = require( "./errors/invalidType" );

var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/lang/isUndefined" );

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
 * @param {Paper} paper The paper to be used for running assessments.
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var Assessor = function( i18n ) {
	this.setI18n( i18n );
	this.taskList = [];
};

/**
 * Checks if the argument is a valid paper.
 * @param paper The paper to be used for the assessments
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 */
Assessor.prototype.verifyPaper = function( paper ) {
	if ( !( paper instanceof Paper ) ) {
		throw new InvalidTypeError( "The assessor requires an Paper object." );
	}
};

/**
 * Checks if the i18n object is defined and sets it.
 * @param {object} i18n
 * @throws {MissingArgument} Parameter needs to be a valid i18n object.
 */
Assessor.prototype.setI18n = function( i18n ) {
	if ( isUndefined( i18n ) ) {
		throw new MissingArgument( "The assessor requires an i18n object." );
	}
	this.i18n = i18n;
};

/**
 * Gets all available assessments.
 * @returns {object} assessment
 */
Assessor.prototype.getAvailableAssessments = function() {
	return assessments;
};

/**
 * Runs the researches defined in the tasklist or the default researches.
 * @returns result
 */
Assessor.prototype.assess = function( paper ) {
	this.verifyPaper( paper );
	var researcher = new Researcher( paper );

	var assessments = this.getAvailableAssessments();
	var results = [];
	for ( var assessment in assessments ) {
		if ( assessments.hasOwnProperty( assessment ) ) {
			results.push(
				assessments[ assessment ]( paper, researcher, this.i18n )
			 );
		}
	}
	return results;
};

module.exports = Assessor;

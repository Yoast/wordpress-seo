var Researcher = require( "./researcher.js" );

var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );

var ScoreRating = 9;

// Assessments
var assessments = {};
assessments.wordCount = require( "./assessments/textLengthAssessment.js" );
assessments.urlLength = require( "./assessments/urlLengthAssessment.js" );
assessments.fleschReading = require( "./assessments/fleschReadingEaseAssessment.js" );
assessments.linkCount = require( "./assessments/textCompetingLinksAssessment.js" );
assessments.getLinkStatistics = require( "./assessments/textLinksAssessment.js" );
assessments.pageTitleKeyword = require( "./assessments/titleKeywordAssessment.js" );
assessments.subHeadings = require( "./assessments/subheadingsKeywordAssessment.js" );
assessments.matchSubheadings = require( "./assessments/textSubheadingsAssessment.js" );
assessments.keywordDensity = require( "./assessments/keywordDensityAssessment.js" );
assessments.stopwordKeywordCount = require( "./assessments/keywordStopWordsAssessment.js" );
assessments.urlStopwords = require( "./assessments/urlStopWordsAssessment.js" );
assessments.metaDescriptionLength = require( "./assessments/metaDescriptionLengthAssessment.js" );
assessments.keyphraseSizeCheck = require( "./assessments/keyphraseLengthAssessment.js" );
assessments.metaDescriptionKeyword = require ( "./assessments/metaDescriptionKeywordAssessment.js" );
assessments.imageCount = require( "./assessments/textImagesAssessment.js" );
assessments.urlKeyword = require( "./assessments/urlKeywordAssessment.js" );
assessments.firstParagraph = require( "./assessments/introductionKeywordAssessment.js" );
assessments.pageTitleLength = require( "./assessments/titleLengthAssessment.js" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var Assessor = function( i18n ) {
	this.setI18n( i18n );
};

/**
 * Checks if the i18n object is defined and sets it.
 * @param {Object} i18n The i18n object used for translations.
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
 * Checks whether or not the Assessment is applicable.
 * @param {Object} assessment The Assessment object that needs to be checked.
 * @param {Paper} paper The Paper object to check against.
 * @param {Researcher} [researcher] The Researcher object containing additional information.
 * @returns {boolean} Whether or not the Assessment is applicable.
 */
Assessor.prototype.isApplicable = function( assessment, paper, researcher ) {
	if ( assessment.hasOwnProperty( "isApplicable" ) ) {
		return assessment.isApplicable( paper, researcher );
	}

	return true;
};

/**
 * Runs the researches defined in the tasklist or the default researches.
 * @param {Paper} paper The paper to run assessments on.
 */
Assessor.prototype.assess = function( paper ) {
	var researcher = new Researcher( paper );
	var assessments = this.getAvailableAssessments();
	this.results = [];

	forEach( assessments, function( assessment, name ) {
		if ( !this.isApplicable( assessment, paper, researcher ) ) {
			return;
		}

		this.results.push( {
			name: name,
			result: assessment.getResult( paper, researcher, this.i18n )
		} );

	}.bind( this ) );
};

/**
 * Filters out all assessmentresults that have no score and no text.
 * @returns {Array<AssessmentResult>} The array with all the valid assessments.
 */
Assessor.prototype.getValidResults = function() {
	var validResults = [];

	forEach( this.results, function( assessmentResults ) {
		if ( !this.isValidResult( assessmentResults.result ) ) {
			return;
		}

		validResults.push( assessmentResults.result );
	}.bind( this ) );

	return validResults;
};

/**
 * Returns if an assessmentResult is valid.
 * @param {object} assessmentResult The assessmentResult to validate.
 * @returns {boolean} whether or not the result is valid.
 */
Assessor.prototype.isValidResult = function( assessmentResult ) {
	return assessmentResult.hasScore() && assessmentResult.hasText();
};

/**
 * Returns the overallscore. Calculates the totalscore by adding all scores and dividing these
 * by the number of results times the ScoreRating.
 *
 * @returns {number} The overallscore
 */
Assessor.prototype.calculateOverallScore  = function() {
	var results = this.getValidResults();
	var totalScore = 0;

	forEach( results, function( assessmentResult ) {
		totalScore += assessmentResult.getScore();
	} );

	return Math.round( totalScore / ( results.length * ScoreRating ) * 100 );
};

/**
 * Register an assessment to add it to the internal assessments object.
 *
 * @param {string} name The name of the assessment.
 * @param {object} assessment The object containing function to run as an assessment and it's requirements.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Assessor.prototype.addAssessment = function( name, assessment ) {
	assessments[ name ] = assessment;
	return true;
};

module.exports = Assessor;

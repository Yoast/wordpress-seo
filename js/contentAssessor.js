var Assessor = require( "./assessor.js" );

var fleschReadingEase = require( "./assessments/fleschReadingEaseAssessment.js" );
var paragraphTooLong = require( "./assessments/paragraphTooLongAssessment.js" );
var sentenceLengthInText = require( "./assessments/sentenceLengthInTextAssessment.js" );
//var subHeadingLength = require( "./assessments/getSubheadingLengthAssessment.js" );
var subheadingDistributionTooLong = require( "./assessments/subheadingDistributionTooLongAssessment.js" );
//var getSubheadingPresence = require( "./assessments/subheadingPresenceAssessment.js" );
var transitionWords = require( "./assessments/transitionWordsAssessment.js" );
var passiveVoice = require( "./assessments/passiveVoiceAssessment.js" );
// var sentenceVariation = require( "./assessments/sentenceVariationAssessment.js" );
// var sentenceBeginnings = require( "./assessments/sentenceBeginningsAssessment.js" );
// var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
// var subheadingDistributionTooShort = require( "./assessments/subheadingDistributionTooShortAssessment.js" );
// var paragraphTooShort = require( "./assessments/paragraphTooShortAssessment.js" );
// var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );

var scoreToRating = require( "./interpreters/scoreToRating" );

var map = require( "lodash/map" );
var sum = require( "lodash/sum" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var ContentAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		fleschReadingEase,
		//getSubheadingPresence,
		subheadingDistributionTooLong,
		//subHeadingLength,
		paragraphTooLong,
		sentenceLengthInText,
		transitionWords,
		passiveVoice
		// sentenceVariation,
		// sentenceBeginnings,
		// wordComplexity,
		// subheadingDistributionTooShort,
		// paragraphTooShort
		// sentenceLengthInDescription,
	];
};

require( "util" ).inherits( ContentAssessor, Assessor );

/**
 * Calculates the negative points based on the assessment results.
 *
 * @returns {number} The total negative points for the results.
 */
ContentAssessor.prototype.calculateNegativePoints = function() {
	var results = this.getValidResults();

	var negativePoints = map( results, function( result ) {
		var weight, rating = scoreToRating( result.getScore() );

		// Convert the ratings to negative 'points'.
		switch ( rating ) {
			case "bad":
				weight = 3;
				break;

			case "ok":
				weight = 2;
				break;

			default:
			case "good":
				weight = 0;
				break;
		}

		return weight;
	} );

	return sum( negativePoints );
};

/**
 * Rates the negative points
 *
 * @param {number} totalNegativePoints The amount of negative points.
 * @returns {number} The score based on the amount of negative points.
 *
 * @private
 */
ContentAssessor.prototype._rateNegativePoints = function( totalNegativePoints ) {
	// Determine the total score based on the total negative points.
	if ( totalNegativePoints > 6 ) {
		// A red indicator.
		return 30;
	}

	if ( totalNegativePoints > 4 ) {
		// An orange indicator.
		return 60;
	}

	// A green indicator.
	return 90;
};

/**
 * Calculates the overall score based on the assessment results.
 *
 * @returns {number} The overall score.
 */
ContentAssessor.prototype.calculateOverallScore = function() {
	var results = this.getValidResults();

	// If you have no content, you have a red indicator.
	if ( results.length === 0 ) {
		return 30;
	}

	var totalNegativePoints = this.calculateNegativePoints();

	return this._rateNegativePoints( totalNegativePoints );
};

module.exports = ContentAssessor;


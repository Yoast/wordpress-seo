let Assessor = require( "./assessor.js" );

let FleschReadingEase = require( "./assessments/readability/fleschReadingEaseAssessment.js" );
let paragraphTooLong = require( "./assessments/readability/paragraphTooLongAssessment.js" );
let SentenceLengthInText = require( "./assessments/readability/sentenceLengthInTextAssessment.js" );
let SubheadingDistributionTooLong = require( "./assessments/readability/subheadingDistributionTooLongAssessment.js" );
let transitionWords = require( "./assessments/readability/transitionWordsAssessment.js" );
let passiveVoice = require( "./assessments/readability/passiveVoiceAssessment.js" );
let sentenceBeginnings = require( "./assessments/readability/sentenceBeginningsAssessment.js" );
let textPresence = require( "./assessments/readability/textPresenceAssessment.js" );

let contentConfiguration = require( "./config/content/combinedConfig.js" );

/*
	Temporarily disabled:

	var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
	var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );
 */

let scoreToRating = require( "./interpreters/scoreToRating" );

import { map } from "lodash-es";
import { sum } from "lodash-es";

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 * @param {string} options.locale The locale.
 *
 * @constructor
 */
let ContentAssessor = function( i18n, options = {} ) {
	Assessor.call( this, i18n, options );
	let locale = ( options.hasOwnProperty( "locale" ) ) ? options.locale : "en_US";

	this._assessments = [

		new FleschReadingEase( contentConfiguration( locale ).fleschReading ),
		new SubheadingDistributionTooLong(),
		paragraphTooLong,
		new SentenceLengthInText( contentConfiguration( locale ).sentenceLength ),
		transitionWords,
		passiveVoice,
		textPresence,
		sentenceBeginnings,
		// Temporarily disabled: wordComplexity,
	];
};

require( "util" ).inherits( ContentAssessor, Assessor );

/**
 * Calculates the weighted rating for languages that have all assessments based on a given rating.
 *
 * @param {number} rating The rating to be weighted.
 * @returns {number} The weighted rating.
 */
ContentAssessor.prototype.calculatePenaltyPointsFullSupport = function( rating ) {
	switch ( rating ) {
		case "bad":
			return 3;
		case "ok":
			return 2;
		default:
		case "good":
			return 0;
	}
};

/**
 * Calculates the weighted rating for languages that don't have all assessments based on a given rating.
 *
 * @param {number} rating The rating to be weighted.
 * @returns {number} The weighted rating.
 */
ContentAssessor.prototype.calculatePenaltyPointsPartialSupport = function( rating ) {
	switch ( rating ) {
		case "bad":
			return 4;
		case "ok":
			return 2;
		default:
		case "good":
			return 0;
	}
};

/**
 * Determines whether a language is fully supported. If a language supports 8 content assessments
 * it is fully supported
 *
 * @returns {boolean} True if fully supported.
 */
ContentAssessor.prototype._allAssessmentsSupported = function() {
	let numberOfAssessments = 8;
	let applicableAssessments = this.getApplicableAssessments();
	return applicableAssessments.length === numberOfAssessments;
};

/**
 * Calculates the penalty points based on the assessment results.
 *
 * @returns {number} The total penalty points for the results.
 */
ContentAssessor.prototype.calculatePenaltyPoints = function() {
	let results = this.getValidResults();

	let penaltyPoints = map( results, function( result ) {
		let rating = scoreToRating( result.getScore() );

		if ( this._allAssessmentsSupported() ) {
			return this.calculatePenaltyPointsFullSupport( rating );
		}

		return this.calculatePenaltyPointsPartialSupport( rating );
	}.bind( this ) );

	return sum( penaltyPoints );
};

/**
 * Rates the penalty points
 *
 * @param {number} totalPenaltyPoints The amount of penalty points.
 * @returns {number} The score based on the amount of penalty points.
 *
 * @private
 */
ContentAssessor.prototype._ratePenaltyPoints = function( totalPenaltyPoints ) {
	if ( this.getValidResults().length === 1 ) {
		// If we have only 1 result, we only have a "no content" result
		return 30;
	}

	if ( this._allAssessmentsSupported() ) {
		// Determine the total score based on the total penalty points.
		if ( totalPenaltyPoints > 6 ) {
			// A red indicator.
			return 30;
		}

		if ( totalPenaltyPoints > 4 ) {
			// An orange indicator.
			return 60;
		}
	} else {
		if ( totalPenaltyPoints > 4 ) {
			// A red indicator.
			return 30;
		}

		if ( totalPenaltyPoints > 2 ) {
			// An orange indicator.
			return 60;
		}
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
	let results = this.getValidResults();

	// If you have no content, you have a red indicator.
	if ( results.length === 0 ) {
		return 30;
	}

	let totalPenaltyPoints = this.calculatePenaltyPoints();

	return this._ratePenaltyPoints( totalPenaltyPoints );
};

module.exports = ContentAssessor;


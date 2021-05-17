import Assessor from "./assessor.js";
import fleschReadingEase from "./assessments/readability/fleschReadingEaseAssessment.js";
import paragraphTooLong from "./assessments/readability/paragraphTooLongAssessment.js";
import SentenceLengthInText from "./assessments/readability/sentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "./assessments/readability/subheadingDistributionTooLongAssessment.js";
import transitionWords from "./assessments/readability/transitionWordsAssessment.js";
import passiveVoice from "./assessments/readability/passiveVoiceAssessment.js";
import sentenceBeginnings from "./assessments/readability/sentenceBeginningsAssessment.js";
import textPresence from "./assessments/readability/textPresenceAssessment.js";

/*
	Temporarily disabled:

	var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
	var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );
 */

import scoreToRating from "./interpreters/scoreToRating";

import { map } from "lodash-es";
import { sum } from "lodash-es";

/**
 * Creates the Assessor
 *
 * @param {object}  i18n            The i18n object used for translations.
 * @param {object}  researcher      The researcher to use for the analysis.
 * @param {Object}  options         The options for this assessor.
 * @param {Object}  options.marker  The marker to pass the list of marks to.
 *
 * @constructor
 */
const ContentAssessor = function( i18n, researcher, options = {} ) {
	Assessor.call( this, i18n, researcher, options );
	this.type = "ContentAssessor";
	this._assessments = [

		fleschReadingEase,
		new SubheadingDistributionTooLong(),
		paragraphTooLong,
		new SentenceLengthInText(),
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
	const numberOfAssessments = 8;
	const applicableAssessments = this.getApplicableAssessments();
	return applicableAssessments.length === numberOfAssessments;
};

/**
 * Calculates the penalty points based on the assessment results.
 *
 * @returns {number} The total penalty points for the results.
 */
ContentAssessor.prototype.calculatePenaltyPoints = function() {
	const results = this.getValidResults();

	const penaltyPoints = map( results, function( result ) {
		const rating = scoreToRating( result.getScore() );

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
	const results = this.getValidResults();

	// If you have no content, you have a red indicator.
	if ( results.length === 0 ) {
		return 30;
	}

	const totalPenaltyPoints = this.calculatePenaltyPoints();

	return this._ratePenaltyPoints( totalPenaltyPoints );
};

export default ContentAssessor;


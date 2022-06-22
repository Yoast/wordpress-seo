import { createAnchorOpeningTag } from "../../helpers/shortlinker";
import WordComplexityAssessment from "../assessments/readability/WordComplexityAssessment";
import Assessor from "../assessor.js";
import ParagraphTooLong from "../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInText from "../assessments/readability/SentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import TransitionWords from "../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoice from "../assessments/readability/PassiveVoiceAssessment.js";
import SentenceBeginnings from "../assessments/readability/SentenceBeginningsAssessment.js";
import TextPresence from "../assessments/readability/TextPresenceAssessment.js";

/*
	Temporarily disabled:

	var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
	var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );
 */

import scoreToRating from "../interpreters/scoreToRating";

import { map } from "lodash-es";
import { sum } from "lodash-es";

/**
 * Creates the Assessor
 *
 * @param {object}  researcher      The researcher to use for the analysis.
 * @param {Object}  options         The options for this assessor.
 * @param {Object}  options.marker  The marker to pass the list of marks to.
 *
 * @constructor
 */
const StorePostsAndPagesContentAssessor = function( researcher, options = {} ) {
	Assessor.call( this, researcher, options );
	this.type = "storePostsAndPagesContentAssessor";
	this._assessments = [

		new SubheadingDistributionTooLong( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify68" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify69" ),
		} ),
		new ParagraphTooLong( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify66" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify67" ),
		} ),
		new SentenceLengthInText( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify48" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify49" ),
		} ),
		new TransitionWords( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify44" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify45" ),
		} ),
		new PassiveVoice( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify42" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify43" ),
		} ),
		new TextPresence( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify56" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify57" ),
		} ),
		new SentenceBeginnings( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify5" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify65" ),
		} ),
		new WordComplexityAssessment( {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify77" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify78" ),
		} ),
	];
};

require( "util" ).inherits( StorePostsAndPagesContentAssessor, Assessor );

/**
 * Calculates the weighted rating for languages that have all assessments based on a given rating.
 *
 * @param {number} rating The rating to be weighted.
 * @returns {number} The weighted rating.
 */
StorePostsAndPagesContentAssessor.prototype.calculatePenaltyPointsFullSupport = function( rating ) {
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
StorePostsAndPagesContentAssessor.prototype.calculatePenaltyPointsPartialSupport = function( rating ) {
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
StorePostsAndPagesContentAssessor.prototype._allAssessmentsSupported = function() {
	const numberOfAssessments = 8;
	const applicableAssessments = this.getApplicableAssessments();
	return applicableAssessments.length === numberOfAssessments;
};

/**
 * Calculates the penalty points based on the assessment results.
 *
 * @returns {number} The total penalty points for the results.
 */
StorePostsAndPagesContentAssessor.prototype.calculatePenaltyPoints = function() {
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
StorePostsAndPagesContentAssessor.prototype._ratePenaltyPoints = function( totalPenaltyPoints ) {
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
StorePostsAndPagesContentAssessor.prototype.calculateOverallScore = function() {
	const results = this.getValidResults();

	// If you have no content, you have a red indicator.
	if ( results.length === 0 ) {
		return 30;
	}

	const totalPenaltyPoints = this.calculatePenaltyPoints();

	return this._ratePenaltyPoints( totalPenaltyPoints );
};

export default StorePostsAndPagesContentAssessor;


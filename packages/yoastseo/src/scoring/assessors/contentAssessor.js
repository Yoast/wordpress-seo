import { map, sum } from "lodash";
import Assessor from "./assessor.js";
import ParagraphTooLong from "../assessments/readability/ParagraphTooLongAssessment.js";
import SentenceLengthInText from "../assessments/readability/SentenceLengthInTextAssessment.js";
import SubheadingDistributionTooLong from "../assessments/readability/SubheadingDistributionTooLongAssessment.js";
import TransitionWords from "../assessments/readability/TransitionWordsAssessment.js";
import PassiveVoice from "../assessments/readability/PassiveVoiceAssessment.js";
import SentenceBeginnings from "../assessments/readability/SentenceBeginningsAssessment.js";
import TextPresence from "../assessments/readability/TextPresenceAssessment.js";
import scoreToRating from "../interpreters/scoreToRating.js";

/**
 * The ContentAssessor class is used for the readability analysis.
 */
export default class ContentAssessor extends Assessor {
	/**
	 * Creates a new ContentAssessor instance.
	 * @param {Researcher}	researcher	The researcher to use.
	 * @param {Object}		[options]	The assessor options.
	 */
	constructor( researcher, options ) {
		super( researcher, options );
		this.type = "contentAssessor";

		this._assessments = [
			new SubheadingDistributionTooLong(),
			new ParagraphTooLong(),
			new SentenceLengthInText(),
			new TransitionWords(),
			new PassiveVoice(),
			new TextPresence(),
			new SentenceBeginnings(),
		];
	}

	/**
	 * Calculates the weighted rating for languages that have all assessments based on a given rating.
	 *
	 * @param {string} rating The rating to be weighted.
	 * @returns {number} The weighted rating.
	 */
	calculatePenaltyPointsFullSupport( rating ) {
		switch ( rating ) {
			case "bad":
				return 3;
			case "ok":
				return 2;
			default:
			case "good":
				return 0;
		}
	}

	/**
	 * Calculates the weighted rating for languages that don't have all assessments based on a given rating.
	 *
	 * @param {string} rating The rating to be weighted.
	 * @returns {number} The weighted rating.
	 */
	calculatePenaltyPointsPartialSupport( rating ) {
		switch ( rating ) {
			case "bad":
				return 4;
			case "ok":
				return 2;
			default:
			case "good":
				return 0;
		}
	}

	/**
	 * Determines whether a language is fully supported. If a language supports 7 content assessments,
	 * it is fully supported
	 *
	 * @returns {boolean} True if fully supported.
	 */
	_allAssessmentsSupported() {
		const numberOfAssessments = this._assessments.length;
		const applicableAssessments = this.getApplicableAssessments();
		return applicableAssessments.length === numberOfAssessments;
	}

	/**
	 * Calculates the penalty points based on the assessment results.
	 *
	 * @returns {number} The total penalty points for the results.
	 */
	calculatePenaltyPoints() {
		const results = this.getValidResults();

		const penaltyPoints = map( results, function( result ) {
			const rating = scoreToRating( result.getScore() );

			if ( this._allAssessmentsSupported() ) {
				return this.calculatePenaltyPointsFullSupport( rating );
			}

			return this.calculatePenaltyPointsPartialSupport( rating );
		}.bind( this ) );

		return sum( penaltyPoints );
	}

	/**
	 * Rates the penalty points
	 *
	 * @param {number} totalPenaltyPoints The amount of penalty points.
	 * @returns {number} The score based on the amount of penalty points.
	 *
	 * @private
	 */
	_ratePenaltyPoints( totalPenaltyPoints ) {
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
	}

	/**
	 * Calculates the overall score based on the assessment results.
	 *
	 * @returns {number} The overall score.
	 */
	calculateOverallScore() {
		const results = this.getValidResults();

		// If you have no content, you have a red indicator.
		if ( results.length === 0 ) {
			return 30;
		}

		const totalPenaltyPoints = this.calculatePenaltyPoints();

		return this._ratePenaltyPoints( totalPenaltyPoints );
	}
}

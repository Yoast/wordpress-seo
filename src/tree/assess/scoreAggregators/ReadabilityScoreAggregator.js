import { scoreToRating } from "../../../interpreters";

/* Internal dependencies */
import { ScoreAggregator } from "../index";

/**
 * Total number of available readability assessments.
 *
 * To do: Compute this, rather than set this and keep this updated (see https://github.com/Yoast/YoastSEO.js/pull/2176#discussion_r261547836)
 *
 * @type {number}
 * @const
 */
const totalNrOfAssessments = 8;

/**
 * Penalties that can be given on each assessment
 * when all assessments are currently supported
 * for the user's language.
 *
 * @type {{ok: number, bad: number, good: number}}
 * @const
 */
const penaltyMappingFullSupport = {
	bad: 3,
	ok: 2,
	good: 0,
};

/**
 * Penalties that can be given on each assessment
 * when only a part of the assessments are currently supported
 * for the user's language.
 *
 * @type {{ok: number, bad: number, good: number}}
 * @const
 */
const penaltyMappingPartialSupport = {
	bad: 4,
	ok: 2,
	good: 0,
};

/**
 * The scores that can be given on the readability analysis.
 *
 * @type {{GOOD: number, OKAY: number, NEEDS_IMPROVEMENT: number}}
 * @const
 */
export const READABILITY_SCORES = {
	GOOD: 90,
	OKAY: 60,
	NEEDS_IMPROVEMENT: 30,
};

/**
 * Aggregates the results of the readability analysis into a single score.
 */
class ReadabilityScoreAggregator extends ScoreAggregator {
	/**
	 * Determines whether a language is fully supported. If a language supports 8 content assessments
	 * it is fully supported.
	 *
	 * @param {AssessmentResult[]} results The list of results.
	 *
	 * @returns {boolean} True if fully supported.
	 */
	allAssessmentsSupported( results ) {
		/*
		 * Apparently, we (in the previous `contentAssessor`) check whether an assessment is applicable
		 * as a way to check if it is supported for the current language.
		 *
		 * Although we do check whether a language is supported in some readability assessments,
		 * we also check whether papers have text to analyze among other things.
		 *
		 * Since only applicable assessments are applied, we only get the results
		 * of applicable assessments either way. So this check suffices.
		 */
		return results.length === totalNrOfAssessments;
	}

	/**
	 * Calculates the total score (GOOD, OKAY or NEEDS IMPROVEMENT)
	 * based on the total penalty score.
	 *
	 * @param {boolean} allAssessmentsSupported Whether all assessments are supported for this language.
	 * @param {number}  penalty                 The total penalty.
	 *
	 * @returns {number} The total score.
	 */
	calculateScore( allAssessmentsSupported, penalty ) {
		if ( allAssessmentsSupported ) {
			if ( penalty > 6 ) {
				return READABILITY_SCORES.NEEDS_IMPROVEMENT;
			}

			if ( penalty > 4 ) {
				return READABILITY_SCORES.OKAY;
			}
		} else {
			if ( penalty > 4 ) {
				return READABILITY_SCORES.NEEDS_IMPROVEMENT;
			}

			if ( penalty > 2 ) {
				return READABILITY_SCORES.OKAY;
			}
		}
		return READABILITY_SCORES.GOOD;
	}

	/**
	 * Calculates the total penalty based on the given assessment results.
	 *
	 * @param {AssessmentResult[]} results The valid results from which to calculate the total penalty.
	 *
	 * @returns {number} The total penalty for the results.
	 */
	calculatePenalty( results ) {
		return results.reduce( ( sum, result ) => {
			// Compute the rating ("error", "feedback", "bad", "ok" or "good").
			const rating = scoreToRating( result.getScore() );

			const penalty = this.allAssessmentsSupported( results )
				? penaltyMappingFullSupport[ rating ]
				: penaltyMappingPartialSupport[ rating ];

			// Add penalty when available.
			return penalty ? sum + penalty : sum;
		}, 0 );
	}

	/**
	 * Returns the list of valid results.
	 * Valid results are all results that have a score and a text.
	 *
	 * @param {AssessmentResult[]} results The results to filter the valid results from.
	 *
	 * @returns {AssessmentResult[]} The list of valid results.
	 */
	getValidResults( results ) {
		return results.filter( result => result.hasScore() && result.hasText() );
	}

	/**
	 * Aggregates the given assessment results into a single analysis score.
	 *
	 * @param {AssessmentResult[]} results The assessment results.
	 *
	 * @returns {number} The aggregated score.
	 */
	aggregate( results ) {
		const validResults = this.getValidResults( results );

		/*
		 * If you have no content, you have a red indicator.
		 * (Assume that one result always means the 'no content' assessment result).
		 */
		if ( validResults.length <= 1 ) {
			return READABILITY_SCORES.NEEDS_IMPROVEMENT;
		}

		const penalty = this.calculatePenalty( results );
		return this.calculateScore( this.allAssessmentsSupported( results ), penalty );
	}
}

export default ReadabilityScoreAggregator;

import getLanguage from "../../languageProcessing/helpers/language/getLanguage";
import { scoreToRating } from "../interpreters";

/* Internal dependencies */
import ScoreAggregator from "./ScoreAggregator";

/**
 * Penalties that can be given on each assessment
 * when all assessments are currently supported
 * for the user's language.
 *
 * @type {{ok: number, bad: number, good: number}}
 * @const
 *
 * @memberOf module:parsedPaper/assess
 */
const PENALTY_MAPPING_FULL_SUPPORT = {
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
 *
 * @memberOf module:parsedPaper/assess
 */
const PENALTY_MAPPING_PARTIAL_SUPPORT = {
	bad: 4,
	ok: 2,
	good: 0,
};

/**
 * The scores that can be given on the readability analysis.
 *
 * @type {{GOOD: number, OKAY: number, NEEDS_IMPROVEMENT: number, NOT_AVAILABLE: number}}
 * @const
 *
 * @memberOf module:parsedPaper/assess
 */
export const READABILITY_SCORES = {
	GOOD: 90,
	OKAY: 60,
	NEEDS_IMPROVEMENT: 30,
	NOT_AVAILABLE: 0,
};

/**
 * A list of all the languages that have full support in the readability analysis.
 *
 * @type {string[]}
 * @const
 */
const FULLY_SUPPORTED_LANGUAGES = [ "en", "nl", "de", "it", "ru", "fr", "es" ];

/**
 * Aggregates the results of the readability analysis into a single score.
 *
 * @memberOf module:parsedPaper/assess
 */
class ReadabilityScoreAggregator extends ScoreAggregator {
	/**
	 * Determines whether a language is fully supported.
	 *
	 * @param {string} locale The locale for which the content is written, e.g. `sv-SE` for Sweden.
	 *
	 * @returns {boolean} `true` if fully supported.
	 */
	isFullySupported( locale ) {
		// Sanity check if this is actually a locale string.
		if ( locale && locale.includes( "_" ) ) {
			const language = getLanguage( locale );
			return FULLY_SUPPORTED_LANGUAGES.includes( language );
		}
		// Default to not fully supported.
		return false;
	}

	/**
	 * Calculates the overall score (GOOD, OKAY or NEEDS IMPROVEMENT)
	 * based on the penalty.
	 *
	 * @param {boolean} isFullySupported Whether this language is fully supported.
	 * @param {number}  penalty          The total penalty.
	 *
	 * @returns {number} The overall score.
	 */
	calculateScore( isFullySupported, penalty ) {
		if ( isFullySupported ) {
			/*
			 * If the language is fully supported, we are more lenient.
			 * A higher penalty is needed to get lower scores.
			 */
			if ( penalty > 6 ) {
				return READABILITY_SCORES.NEEDS_IMPROVEMENT;
			}

			if ( penalty > 4 ) {
				/*
				 * A penalty between 4 and 6 means either:
				 *  - One "ok" and one "bad" result (5).
				 *  - Two "bad" results of 3 points each (6).
				 *  - Three "ok" results of 2 points each (6).
				 */
				return READABILITY_SCORES.OKAY;
			}
		} else {
			/*
			 * If the language is NOT fully supported, we are more stringent.
			 * The penalty threshold for getting lower scores is set lower.
			 */
			if ( penalty > 4 ) {
				return READABILITY_SCORES.NEEDS_IMPROVEMENT;
			}

			if ( penalty > 2 ) {
				/*
				 * A penalty of 3 or 4 means:
				 *  - Two "ok" results of 2 points each (4).
				 *  - One "bad" result of 4 points (4).
				 */
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

			const penalty = this.isFullySupported( this.locale )
				? PENALTY_MAPPING_FULL_SUPPORT[ rating ]
				: PENALTY_MAPPING_PARTIAL_SUPPORT[ rating ];

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
	 * Sets the locale of the content. We are more lenient on languages
	 * that are fully supported in the analysis.
	 *
	 * @param {string} locale The locale of the content.
	 *
	 * @returns {void}
	 */
	setLocale( locale ) {
		this.locale = locale;
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
		 * If you have no content, you have a gray indicator.
		 * (Assume that one result always means the 'no content' assessment result).
		 */
		if ( validResults.length <= 1 ) {
			return READABILITY_SCORES.NOT_AVAILABLE;
		}

		const penalty = this.calculatePenalty( validResults );
		const isFullySupported = this.isFullySupported( this.locale );
		return this.calculateScore( isFullySupported, penalty );
	}
}

export default ReadabilityScoreAggregator;

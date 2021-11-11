import { ANALYSIS_RATINGS } from "../common/constants";

/**
 * Interpreters a score and gives it a particular rating.
 *
 * @param {Number} score The score to interpreter.
 * @returns {string} The rating, given based on the score.
 */
export const analysisScoreToRating = ( score ) => {
	if ( score === -1 ) {
		return ANALYSIS_RATINGS.ERROR;
	}

	if ( score === 0 ) {
		return ANALYSIS_RATINGS.FEEDBACK;
	}

	if ( score <= 4 ) {
		return ANALYSIS_RATINGS.BAD;
	}

	if ( score > 4 && score <= 7 ) {
		return ANALYSIS_RATINGS.OK;
	}

	if ( score > 7 ) {
		return ANALYSIS_RATINGS.GOOD;
	}

	return "";
};

/*
 * Action types
 */
export const SET_WORDS_FOR_INSIGHTS = "SET_WORDS_FOR_INSIGHTS";

/*
 * Action creators
 */

/**
 * An action creator for setting the prominent words for insights.
 *
 * @param {array} wordsForInsights The prominent words to be used for insights.
 *
 * @returns {Object} A set words for insights action.
 */
export function setWordsForInsights( wordsForInsights ) {
	return {
		type: SET_WORDS_FOR_INSIGHTS,
		wordsForInsights: wordsForInsights,
	};
}

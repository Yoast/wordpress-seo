import { get } from "lodash";

/**
 * Gets the Estimated Reading Time from the store.
 *
 * @param {Object} state The state.
 *
 * @returns {number} The estimated reading time.
 */
export const getEstimatedReadingTime = state => get( state, "insights.estimatedReadingTime", 0 );

/**
 * Gets the flesch reading ease score from the store.
 *
 * @param {Object} state The state.
 *
 * @returns {number|null} The flesch reading ease score.
 */
export const getFleschReadingEaseScore = state => get( state, "insights.fleschReadingEaseScore", null );

/**
 * Gets the flesch reading ease difficulty from the store.
 *
 * @param {Object} state The state.
 *
 * @returns {DIFFICULTY|null} The flesch reading ease difficulty.
 */
export const getFleschReadingEaseDifficulty = state => get( state, "insights.fleschReadingEaseDifficulty", null );

/**
 * Checks if the flesch reading ease score and difficulty are available.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether the flesch reading ease score and difficulty are available.
 */
export const isFleschReadingEaseAvailable = state => {
	return getFleschReadingEaseScore( state ) !== null && getFleschReadingEaseDifficulty( state ) !== null;
};

/**
 * Gets the length of the text, either based on the number of words or the number of characters in the text.
 *
 * @param {Object} state The state.
 *
 * @returns {{ count: string, unit: ("character"|"word") }} The text length.
 */
export const getTextLength = state => get( state, "insights.textLength", {} );

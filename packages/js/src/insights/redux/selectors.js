import { get } from "lodash";
import { DIFFICULTY } from "yoastseo";

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
 * @returns {number} The flesch reading ease score.
 */
export const getFleschReadingEaseScore = state => get( state, "insights.fleschReadingEaseScore", 0 );

/**
 * Gets the flesch reading ease difficulty from the store.
 *
 * @param {Object} state The state.
 *
 * @returns {DIFFICULTY} The flesch reading ease difficulty.
 */
export const getFleschReadingEaseDifficulty = state => get( state, "insights.fleschReadingEaseDifficulty", DIFFICULTY.VERY_DIFFICULT );

/**
 * Gets the word count from the store.
 *
 * @param {Object} state The state.
 *
 * @returns {number} The word count.
 */
export const getWordCount = state => get( state, "insights.wordCount", 0 );

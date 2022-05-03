import { SET_WORDS_FOR_INSIGHTS } from "../actions/insights";

/**
 * Initial state
 */
const INITIAL_STATE = [];

/**
 * A reducer for the prominent words object.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The updated prominent words object.
 */
export function wordsForInsightsReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_WORDS_FOR_INSIGHTS:
			return action.wordsForInsights;
		default:
			return state;
	}
}

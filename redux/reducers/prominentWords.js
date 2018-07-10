import { SET_PROMINENT_WORDS } from "../actions/insights";

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
export function prominentWordsReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case SET_PROMINENT_WORDS:
			return action.prominentWords;
		default:
			return state;
	}
}

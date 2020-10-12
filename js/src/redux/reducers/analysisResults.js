import { SET_ANALYSIS_RESULTS } from "../actions";

const INITIAL_STATE = {};

/**
 * Reduces the dispatched action for the snippet editor state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function analysisResultsReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_ANALYSIS_RESULTS:
			return {
				...state,
				...action.payload,
			};
	}
	return state;
}

export default analysisResultsReducer;

import { UPDATE_SNIPPET_DATA, REFRESH_ANALYSIS_DATA_TIMESTAMP } from "../actions";

const INITIAL_STATE = {
	snippet: {},
	timestamp: 0,
};

/**
 * Reduces the dispatched action for the snippet editor state.
 *
 * @param {Object} state The current state.
 * @param {Object} action The action that was just dispatched.
 *
 * @returns {Object} The new state.
 */
function analysisDataReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case UPDATE_SNIPPET_DATA:
			return {
				...state,
				snippet: action.data,
			};
		case REFRESH_ANALYSIS_DATA_TIMESTAMP:
			return {
				...state,
				timestamp: action.timestamp,
			};
	}

	return state;
}

export default analysisDataReducer;

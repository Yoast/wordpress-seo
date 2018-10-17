import { UPDATE_SNIPPET_DATA } from "../actions/analysisData";

const INITIAL_STATE = {
	snippet: {},
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
	}
	return state;
}

export default analysisDataReducer;

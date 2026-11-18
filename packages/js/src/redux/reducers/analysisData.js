import { UPDATE_SNIPPET_DATA, RUN_ANALYSIS, UPDATE_SHORTCODES_FOR_PARSING } from "../actions";

const INITIAL_STATE = {
	snippet: {},
	timestamp: 0,
	shortcodesForParsing: [],
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
		case RUN_ANALYSIS:
			return {
				...state,
				timestamp: action.timestamp,
			};
		case UPDATE_SHORTCODES_FOR_PARSING:
			return {
				...state,
				shortcodesForParsing: action.shortcodesForParsing,
			};
	}

	return state;
}

export default analysisDataReducer;

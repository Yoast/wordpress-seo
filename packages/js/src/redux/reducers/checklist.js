import { ADD_CHECK_LIST } from "../actions";

const INITIAL_STATE = {
	checklistItems: {},
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
		case ADD_CHECK_LIST: {
			const nextState = Object.assign( {}, state );
			nextState.checklistItems[ action.name ] = action.data;
			return nextState;
		}
	}

	return state;
}

export default analysisDataReducer;

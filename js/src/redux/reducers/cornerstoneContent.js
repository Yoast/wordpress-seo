import { TOGGLE_CORNERSTONE_CONTENT } from "../actions/cornerstoneContent";

const INITIAL_STATE = false;

/**
 * A reducer for the active keyword.
 *
 * @param {boolean} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {boolean} The state.
 */
function cornerstoneContentReducer( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case TOGGLE_CORNERSTONE_CONTENT:
			return ! state;
		default:
			return state;
	}
}

export default cornerstoneContentReducer;

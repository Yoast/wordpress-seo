import { SET_MARKER_STATUS } from "../actions/markerButtons";

const INITIAL_STATE = "disabled";

/**
 * A reducer for the active keyword.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action .
 *
 * @returns {Object} The state.
 */
function markerStatusReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_MARKER_STATUS:
			return action.marksButtonStatus;
		default:
			return state;
	}
}

export default markerStatusReducer;

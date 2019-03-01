import { SET_ACTIVE_MARKER } from "../actions/activeMarker";

const INITIAL_STATE = null;

/**
 * A reducer for the active marker button.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action .
 *
 * @returns {Object} The state.
 */
function activeMarker( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_ACTIVE_MARKER:
			return action.activeMarker;
		default:
			return state;
	}
}

export default activeMarker;

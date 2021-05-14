import { SET_MARKER_PAUSE_STATUS } from "../actions/markerPauseStatus";

const INITIAL_STATE = false;

/**
 * Sets the marker pause status.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {boolean} Whether the marker is paused or not.
 */
function setMarkerPauseStatus( state, action ) {
	return action.isMarkerPaused;
}

/**
 * A reducer for the active keyword.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action.
 *
 * @returns {Object} The state.
 */
function markerPauseStatusReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_MARKER_PAUSE_STATUS:
			return setMarkerPauseStatus( state, action );
		default:
			return state;
	}
}

export default markerPauseStatusReducer;

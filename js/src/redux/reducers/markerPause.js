import { SET_MARKER_PAUSE } from "../actions/markerPause";

const INITIAL_STATE = false;

/**
 * Sets the marker pause status.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The SEO results per keyword.
 */
function setMarkerPauseStatus( state, action ) {
	return action.isMarkingPaused;
}

/**
 * A reducer for the active keyword.
 *
 * @param {Object} state The current state of the object.
 * @param {Object} action The received action .
 *
 * @returns {Object} The state.
 */
function markerPauseReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_MARKER_PAUSE:
			return setMarkerPauseStatus( state, action );
		default:
			return state;
	}
}

export default markerPauseReducer;

import { SET_MARKER_STATUS } from "../actions/markerButtons";

const INITIAL_STATE = null;

/**
 * Sets the marker status.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The SEO results per keyword.
 */
function setMarkerStatus( state, action ) {
	return action.marksButtonStatus;
}

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
			return setMarkerStatus( state, action );
		default:
			return state;
	}
}

export default markerStatusReducer;

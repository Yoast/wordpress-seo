import { SET_MARKER, RESET_MARKER } from "../constants";

/**
 * A reducer for the analysis marker state.
 *
 * @param {Object} state The state.
 * @param {Object} action The action.
 *
 * @returns {Object} The new state.
 */
export default function analysisMarkerReducer( state, { type, payload } ) {
	switch ( type ) {
		case SET_MARKER:
			return {
				id: payload.id,
				marks: payload.marks,
			};
		case RESET_MARKER:
			return {
				id: null,
				marks: [],
			};

		default:
			return state;
	}
}

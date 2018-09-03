import * as actions from "../actions/results";
import { SET_ACTIVE_MARKER } from "../actions/results";

const INITIAL_STATE = {
	seo: [],
	readability: [],
	activeMarker: "",
};

/**
 * A reducer for the analysis results.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
export default function results( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case actions.SET_RESULTS:
			return {
				...state,
				seo: action.results.seo,
				readability: action.results.readability,
			};

		case SET_ACTIVE_MARKER:
			return {
				...state,
				activeMarker: action.activeMarker,
			};

		default:
			return state;
	}
}

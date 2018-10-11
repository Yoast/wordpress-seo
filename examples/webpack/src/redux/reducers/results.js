import * as actions from "../actions/results";
import { SET_ACTIVE_MARKER } from "../actions/results";

const INITIAL_STATE = {
	seo: {
		"": {
			results: [],
			score: 0,
		},
	},
	readability: {
		results: [],
		score: 0,
	},
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
				...action.results,
			};

		case SET_ACTIVE_MARKER:
			// Create a toggle effect so that the markings can be turned off.
			return {
				...state,
				activeMarker: state.activeMarker === action.activeMarker ? "" : action.activeMarker,
			};

		default:
			return state;
	}
}

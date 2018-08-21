import * as actions from "../actions/results";

const INITIAL_STATE = {
	seo: [],
	readability: [],
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
			return action.results;

		default:
			return state;
	}
}

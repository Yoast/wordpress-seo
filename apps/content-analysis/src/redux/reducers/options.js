import * as actions from "../actions/options";

const INITIAL_STATE = {};

/**
 * A reducer for the options.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
export default function options( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case actions.SET_OPTIONS:
			return action.options;

		case actions.SET_OPTION:
			return {
				...state,
				[ action.name ]: action.value,
			};

		default:
			return state;
	}
}

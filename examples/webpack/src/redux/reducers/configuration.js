import * as actions from "../actions/configuration";

const INITIAL_STATE = {};

/**
 * A reducer for the configuration.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function configuration( state = INITIAL_STATE, action ) {
	switch( action.type ) {
		case actions.SET_CONFIGURATION:
			return action.configuration;

		case actions.SET_CONFIGURATION_ATTRIBUTE:
			return {
				...state,
				[ action.name ]: action.value,
			};

		default:
			return state;
	}
}

export default configuration;

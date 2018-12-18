import { SET_WARNING_MESSAGE } from "../actions/warning";


const INITIAL_STATE = {
	message: [],
};

/**
 * A reducer for the warning.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
export default function warningReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case SET_WARNING_MESSAGE:
			return {
				...state,
				message: action.message,
			};
		default:
			return state;
	}
}

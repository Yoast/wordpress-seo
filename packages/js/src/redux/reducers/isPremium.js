import { SET_IS_PREMIUM } from "../actions/isPremium";

/**
 * A reducer for the is premium boolean.
 *
 * @param {boolean} state The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {boolean} The state.
 */
const isPremium = ( state = false, action ) => {
	switch ( action.type ) {
		case SET_IS_PREMIUM:
			return action.payload;
		default: return state;
	}
};

export default isPremium;

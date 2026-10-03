import { SET_CURRENT_PROMOTIONS } from "../actions/currentPromotions";

/**
 * A reducer for the current promotions.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The action received.
 *
 * @returns {Object} The state.
 */
function currentPromotionsReducer( state = {}, action ) {
	if ( action.type === SET_CURRENT_PROMOTIONS ) {
		return { promotions: action.payload };
	}

	return state;
}

export default currentPromotionsReducer;

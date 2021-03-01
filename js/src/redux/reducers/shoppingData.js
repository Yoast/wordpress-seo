import { SET_SHOPPING_DATA } from "../actions/shoppingData";
import { pick } from "lodash";

const INITIAL_STATE = null;

/**
 * A reducer for the dismissedAlerts.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function shoppingDataReducer( state = INITIAL_STATE, action ) {
	if ( action.type === SET_SHOPPING_DATA ) {
		const shoppingData = pick( action.shoppingData, [ "rating", "reviewCount", "availability", "price" ] );
		return {
			... state,
			... shoppingData,
		};
	}
	return state;
}

export default shoppingDataReducer;

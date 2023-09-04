import { SET_CURRENT_PROMOTIONS } from "../actions/currentPromotions";
import { get } from "lodash";
/**
 * A reducer for the currentPromotions.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */

function getDefaultState() {
	return get( window, "wpseoScriptData.currentPromotions", {} );
}
function currentPromotionsReducer( state = getDefaultState(), action ) {
	if ( action.type === SET_CURRENT_PROMOTIONS ) {
		return [ ...action.payload ]
	}

	return state;
}

export default currentPromotionsReducer;

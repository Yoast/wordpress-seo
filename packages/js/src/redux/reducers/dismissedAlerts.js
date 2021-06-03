import { get } from "lodash";
import { DISMISS_ALERT_SUCCESS } from "../actions/dismissedAlerts";

const INITIAL_STATE = get( window, "wpseoScriptData.dismissedAlerts", {} );

/**
 * A reducer for the dismissedAlerts.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function dismissedAlertsReducer( state = INITIAL_STATE, action ) {
	if ( action.type === DISMISS_ALERT_SUCCESS && action.alertKey ) {
		// Update the store after the Control has POSTed a dismissal to the database through the REST API.
		return {
			... state,
			[ action.alertKey ]: true,
		};
	}
	return state;
}

export default dismissedAlertsReducer;

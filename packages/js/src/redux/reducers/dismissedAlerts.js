import { DISMISS_ALERT_SUCCESS, SET_DISMISSED_ALERTS } from "../actions/dismissedAlerts";

/**
 * A reducer for the dismissedAlerts.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function dismissedAlertsReducer( state = {}, action ) {
	if ( action.type === DISMISS_ALERT_SUCCESS && action.alertKey ) {
		// Update the store after the Control has POSTed a dismissal to the database through the REST API.
		return {
			... state,
			[ action.alertKey ]: true,
		};
	}

	if ( action.type === SET_DISMISSED_ALERTS ) {
		return { ...action.payload };
	}

	return state;
}

export default dismissedAlertsReducer;

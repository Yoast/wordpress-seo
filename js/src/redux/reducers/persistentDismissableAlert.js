import { DISMISS_ALERT } from "../actions/persistentDismissableAlert";

const INITIAL_STATE = window.wpseoScriptData.dismissedAlerts;

/**
 * A reducer for the dismissedAlerts.
 *
 * @param {Object} state  The current state of the object.
 * @param {Object} action The current action received.
 *
 * @returns {Object} The state.
 */
function dismissedAlertsReducer( state = INITIAL_STATE, action ) {
	switch ( action.type ) {
		case DISMISS_ALERT:
			return {
				... state,
				[ action.alertKey ]: true,
			};
		default:
			return state;
	}
}

export default dismissedAlertsReducer;

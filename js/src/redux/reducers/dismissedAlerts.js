import { DISMISS_ALERT } from "../actions/dismissedAlerts";

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
			// Calling the REST route first.
			window.wpseoApi.post( "alerts/dismiss", { key: action.alertKey }, response => {
				if ( ! response || ! response.success ) {
					return;
				}
			} );

			// Update the store when succesfully dismissed to the database.
			return {
				... state,
				[ action.alertKey ]: true,
			};
		default:
			return state;
	}
}

export default dismissedAlertsReducer;

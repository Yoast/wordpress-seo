export const DISMISS_ALERT = "DISMISS_ALERT";
export const DISMISS_ALERT_SUCCESS = "DISMISS_ALERT_SUCCESS";
export const SET_DISMISSED_ALERTS = "SET_DISMISSED_ALERTS";

/**
 * Creates an action to dismiss an alert.
 * First calls the Control to Post an Alert Dismissal through the REST API.
 * After the Control resolves the reducer is told to add the alertKey to the store.
 *
 * @param {string} alertKey The key of the Alert that needs to be dismissed.
 *
 * @returns {Object} A DISMISS_ALERT_SUCCESS action.
 */
export function* dismissAlert( alertKey ) {
	yield{
		type: DISMISS_ALERT,
		alertKey,
	};

	return {
		type: DISMISS_ALERT_SUCCESS,
		alertKey,
	};
}

/**
 * Set dismissed alerts.
 *
 * @param {Object} dismissedAlerts An object of dismissed alerts keyed by alert key.
 *
 * @returns {Object} A DISMISS_ALERT_SUCCESS action.
 */
export function setDismissedAlerts( dismissedAlerts ) {
	return {
		type: SET_DISMISSED_ALERTS,
		payload: dismissedAlerts,
	};
}

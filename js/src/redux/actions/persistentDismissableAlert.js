export const LOAD_DISMISSED_ALERTS = "LOAD_DISMISSED_ALERTS";
export const DISMISS_ALERT = "DISMISS_ALERT";


/**
 * Creates an action to load the dismissed alerts.
 *
 * @returns {Object} A LOAD_DISMISSED_ALERTS action.
 */
export function loadDismissedAlerts() {
	return {
		type: LOAD_DISMISSED_ALERTS,
		dismissedAlerts: window.wpseoScriptData.dismissedAlerts,
	};
}

/**
 * Creates an action to dismiss an alert.
 *
 * @param {string} alertKey The key of the Alert that needs to be dismissed.
 *
 * @returns {Object} A VIDEO_DISMISS_ALERT action.
 */
export function dismissAlert( alertKey ) {
	return {
		type: DISMISS_ALERT,
		alertKey,
	};
}

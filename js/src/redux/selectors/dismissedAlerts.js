import { get } from "lodash";

/**
 * Selects the dismissedAlerts object.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} The dismissedAlerts object.
 */
export function getDismissedAlerts( state ) {
	return get( state, "editor.dismissedAlerts", true );
}

/**
 * Checks whether a certain Alert is dismissed.
 *
 * @param {Object} state The state.
 * @param {string} alertKey The key of the Alert.
 *
 * @returns {Boolean} Whether or not the Alert is dismissed.
 */
export function isAlertDismissed( state, alertKey ) {
	if ( state.dismissedAlerts[ alertKey ] ) {
		return true;
	}
	return false;
}

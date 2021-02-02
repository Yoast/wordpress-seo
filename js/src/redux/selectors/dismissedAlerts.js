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

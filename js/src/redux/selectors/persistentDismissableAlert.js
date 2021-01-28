import { get } from "lodash";

/**
 * Selects the dismissedAlerts object.
 *
 * @param {Object} state The state.
 *
 * @returns {Array} The reactAlertIsDismissed boolean.
 */
export function getDismissedAlerts( state ) {
	return get( state, "editor.dismissedAlerts", true );
}

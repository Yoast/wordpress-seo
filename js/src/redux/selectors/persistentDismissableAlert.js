import { get } from "lodash";

/**
 * Selects the dismissedAlerts object.
 *
 * @param {Object} state The state.
 *
 * @returns {Array} The dismissedAlerts object.
 */
export function getDismissedAlerts( state ) {
	return get( state, "editor.dismissedAlerts", true );
}

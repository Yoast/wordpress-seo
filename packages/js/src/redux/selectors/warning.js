import { get } from "lodash";

/**
 * Selects the warning messages.
 *
 * @param {Object} state The state.
 *
 * @returns {Array} The warning message or an empty string.
 */
export function getWarningMessage( state ) {
	return get( state, "warning.message", [] );
}

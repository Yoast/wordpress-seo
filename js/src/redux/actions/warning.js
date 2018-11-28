export const SET_WARNING_MESSAGE = "SET_WARNING_MESSAGE";

/**
 * Updates the active marker button id.
 *
 * @param {Array} message The warning message to show. Used as React Node.
 *
 * @returns {Object} An action for redux.
 */
export function setWarningMessage( message ) {
	return {
		type: SET_WARNING_MESSAGE,
		message,
	};
}

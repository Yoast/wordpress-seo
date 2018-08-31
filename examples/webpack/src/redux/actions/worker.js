export const SET_STATUS = "SET_STATUS";

/**
 * Sets the status of the worker.
 *
 * @param {string} status The worker status.
 *
 * @returns {Object} Action object.
 */
export function setStatus( status = "idling" ) {
	return {
		type: SET_STATUS,
		status,
	};
}

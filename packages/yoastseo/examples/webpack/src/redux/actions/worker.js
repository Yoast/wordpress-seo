export const SET_STATUS = "SET_STATUS";
export const SET_AUTOMATIC_REFRESH = "SET_AUTOMATIC_REFRESH";

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

export function setAutomaticRefresh( enabled = false ) {
	return {
		type: SET_AUTOMATIC_REFRESH,
		enabled,
	};
}

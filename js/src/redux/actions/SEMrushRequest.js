export const SET_REQUEST_STARTED = "SET_REQUEST_STARTED";
export const SET_REQUEST_FAILED = "SET_REQUEST_FAILED";

/**
 * Sets the started request.
 *
 * @param {SEMrush request} the started request.
 *
 * @returns {Object} Action object.
 */
export function setRequestStarted( request ) {
	return {
		type: SET_REQUEST_STARTED,
		request,
	};
}

/**
 * Sets the request to succeeded (true) or failed (false).
 *
 * @param {SEMrush request} the request.
 * @param {boolean} the status of the completed request.
 *
 * @returns {Object} Action object.
 */
export function setRequestStatus( request, status ) {
	return {
		type: SET_REQUEST_FAILED,
		request,
		status,
	};
}

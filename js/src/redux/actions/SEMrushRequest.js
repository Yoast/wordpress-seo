export const SET_REQUEST_STARTED = "SET_REQUEST_STARTED";
export const SET_REQUEST_SUCCEEDED = "SET_REQUEST_SUCCEEDED";
export const SET_REQUEST_FAILED = "SET_REQUEST_FAILED";
export const SET_REQUEST_LIMIT_REACHED = "SET_LIMIT_REACHED";
export const SET_REQUEST_COUNTRY = "SET_REQUEST_COUNTRY";

/**
 * An action creator for setting the started request.
 *
 * @returns {Object} Action object.
 */
export function SEMrushRequestStarted() {
	return {
		type: SET_REQUEST_STARTED,
	};
}

/**
 * An action creator for when the request has succeeded.
 *
 * @param {Object} the response of the request.
 *
 * @returns {Object} Action object.
 */
export function SEMrushRequestSucceeded(response ) {
	return {
		type: SET_REQUEST_SUCCEEDED,
		response,
	};
}

/**
 * An action creator for when the request has failed.
 *
 * @param {Object} the response of the request.
 *
 * @returns {Object} Action object.
 */
export function SEMrushRequestFailed(response ) {
	return {
		type: SET_REQUEST_FAILED,
		response,
	};
}

/**
 * An action creator for when the request limit has been reached.
 *
 * @param {Object} The counted amount of requests sent today.
 *
 * @returns {Object} Action object.
 */
export function SEMrushSetRequestLimitReached( countedRequests ) {
	return {
		type: SET_REQUEST_LIMIT_REACHED,
		countedRequests,
	};
}

/**
 * An action creator for when the country has been changed.
 *
 * @param {Object} The newly set country for the SEMrush request.
 *
 * @returns {Object} Action object.
 */
export function SEMrushSetCountry( country ) {
	return {
		type: SET_REQUEST_COUNTRY,
		country,
	};
}

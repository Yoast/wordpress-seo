export const SET_REQUEST_STARTED = "SET_REQUEST_STARTED";
export const SET_REQUEST_SUCCEEDED = "SET_REQUEST_SUCCEEDED";
export const SET_REQUEST_FAILED = "SET_REQUEST_FAILED";
export const SET_REQUEST_LIMIT_REACHED = "SET_LIMIT_REACHED";
export const NEW_REQUEST = "NEW_REQUEST";

/**
 * An action creator for starting a new request.
 *
 * @param {Object} The country for the SEMrush request.
 * @param {string} The keyphrase for the SEMrush request.
 * @param {string} The OAuth token for the SEMrush request.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushNewRequest( country, keyphrase, OAuthToken ) {
	return {
		type: NEW_REQUEST,
		country,
		keyphrase,
		OAuthToken,
	};
}

/**
 * An action creator for when the request has succeeded.
 *
 * @param {Object} the response of the request.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushRequestSucceeded( response ) {
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
export function setSEMrushRequestFailed( response ) {
	return {
		type: SET_REQUEST_FAILED,
		response,
	};
}

/**
 * An action creator for when the request limit has been reached.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushSetRequestLimitReached() {
	return {
		type: SET_REQUEST_LIMIT_REACHED,
	};
}

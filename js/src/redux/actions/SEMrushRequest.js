export const CHANGE_DATABASE = "CHANGE_DATABASE";
export const SET_REQUEST_STARTED = "SET_REQUEST_STARTED";
export const SET_REQUEST_SUCCEEDED = "SET_REQUEST_SUCCEEDED";
export const SET_REQUEST_FAILED = "SET_REQUEST_FAILED";
export const SET_REQUEST_LIMIT_REACHED = "SET_LIMIT_REACHED";
export const NEW_REQUEST = "NEW_REQUEST";

/**
 * An action creator for starting a new request.
 *
 * @param {Object} database The database for the SEMrush request.
 * @param {string} keyphrase The keyphrase for the SEMrush request.
 * @param {string} OAuthToken The token for the SEMrush request.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushNewRequest( database, keyphrase, OAuthToken ) {
	return {
		type: NEW_REQUEST,
		database,
		keyphrase,
		OAuthToken,
	};
}

/**
 * An action creator for when the request has succeeded.
 *
 * @param {Object} response The response of the request.
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
 * @param {Object} response of the request.
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

/**
 * Sets the country of the database in the dropdown menu.
 *
 * @param {string} database The database to be set.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushChangeDatabase( database ) {
	return {
		type: CHANGE_DATABASE,
		database,
	};
}

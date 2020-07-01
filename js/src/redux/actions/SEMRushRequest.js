export const SET_REQUEST_STARTED = "SET_REQUEST_STARTED";
export const SET_REQUEST_FAILED = "SET_REQUEST_FAILED";
export const CHANGE_RELATED_KEYWORD = "CHANGE_RELATED_KEYWORD";
export const REMOVE_RELATED_KEYWORD = "REMOVE_RELATED_KEYWORD";
export const SET_RELATED_KEYWORD_RESULTS = "SET_RELATED_KEYWORD_RESULTS";
export const SET_RELATED_KEYWORD_SYNONYMS = "SET_RELATED_KEYWORD_SYNONYMS";

/**
 * Sets the started request.
 *
 * @param {request} the started request.
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
 * @param {request} the request.
 * @param {boolean} the status of the request.
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

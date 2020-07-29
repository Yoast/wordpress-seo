/**
 * Gets the current request status - pending or done.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current request status.
 */
export function getSEMrushIsRequestPending( state ) {
	return state.SEMrushRequest.isRequestPending;
}

/**
 * Gets the request return state (success or failed).
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current request return state.
 */
export function getSEMrushRequestIsSuccess( state ) {
	return state.SEMrushRequest.isSuccess;
}

/**
 * Gets the request response.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} Current request response.
 */
export function getSEMrushRequestResponse( state ) {
	return state.SEMrushRequest.response;
}

/**
 * Gets the request limit reached boolean.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current request limit reached boolean.
 */
export function getSEMrushRequestLimitReached( state ) {
	return state.SEMrushRequest.limitReached;
}

/**
 * Gets the current keyphrase of the request.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Current request keyphrase.
 */
export function getSEMrushRequestKeyphrase( state ) {
	return state.SEMrushRequest.keyphrase;
}

/**
 * Gets the current OAuth token of the request.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Current request OAuth token.
 */
export function getSEMrushRequestOAuthToken( state ) {
	return state.SEMrushRequest.OAuthToken;
}

/**
 * Gets the currently selected database.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} Current database.
 */
export function getSEMrushSelectedDatabase( state ) {
	return state.SEMrushRequest.database;
}

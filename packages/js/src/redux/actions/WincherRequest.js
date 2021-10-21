export const WINCHER_SET_REQUEST_SUCCEEDED = "WINCHER_SET_REQUEST_SUCCEEDED";
export const WINCHER_SET_REQUEST_FAILED = "WINCHER_SET_REQUEST_FAILED";
export const WINCHER_SET_REQUEST_LIMIT_REACHED = "WINCHER_SET_LIMIT_REACHED";
export const WINCHER_NEW_REQUEST = "WINCHER_NEW_REQUEST";
export const WINCHER_SET_LOGIN_STATUS = "WINCHER_SET_LOGIN_STATUS";
export const WINCHER_SET_TRACK_ALL_REQUEST = "WINCHER_FORCE_SEO_PERFORMANCE_TRACKED_KEYPHRASES";
export const WINCHER_SET_AUTOMATICALLY_TRACK_ALL_REQUEST = "WINCHER_SET_AUTOMATICALLY_TRACK_ALL_REQUEST";

/**
 * An action creator for starting a new request.
 *
 * @returns {Object} Action object.
 */
export function setWincherNewRequest() {
	return {
		type: WINCHER_NEW_REQUEST,
	};
}

/**
 * An action creator for when the request has succeeded.
 *
 * @param {Object} response The response of the request.
 *
 * @returns {Object} Action object.
 */
export function setWincherRequestSucceeded( response ) {
	return {
		type: WINCHER_SET_REQUEST_SUCCEEDED,
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
export function setWincherRequestFailed( response ) {
	return {
		type: WINCHER_SET_REQUEST_FAILED,
		response,
	};
}

/**
 * An action creator for when the request limit has been reached.
 *
 * @param {int} limit The limit assigned to the account.
 *
 * @returns {Object} Action object.
 */
export function setWincherSetKeyphraseLimitReached( limit ) {
	return {
		type: WINCHER_SET_REQUEST_LIMIT_REACHED,
		limit,
	};
}

/**
 * An action creator to check if the user is logged in to Wincher.
 *
 * @param {boolean} loginStatus        The login status.
 * @param {boolean} newlyAuthenticated Whether the login attempt is based on a new OAuth connection.
 *
 * @returns {Object} Action object.
 */
export function setWincherLoginStatus( loginStatus, newlyAuthenticated ) {
	return {
		type: WINCHER_SET_LOGIN_STATUS,
		loginStatus,
		newlyAuthenticated,
	};
}

/**
 * Tracks all keyphrases associated with the current article.
 *
 * @returns {Object} Action object.
 */
export function setWincherTrackAllKeyphrases() {
	return {
		type: WINCHER_SET_TRACK_ALL_REQUEST,
	};
}

/**
 * An action creator for  automatically tracking all keyphrases.
 *
 * @param {boolean} automaticallyTrack Whether to automatically track newly added keyphrases.
 *
 * @returns {Object} Action object.
 */
export function setWincherAutomaticKeyphaseTracking( automaticallyTrack ) {
	return {
		type: WINCHER_SET_AUTOMATICALLY_TRACK_ALL_REQUEST,
		automaticallyTrack,
	};
}


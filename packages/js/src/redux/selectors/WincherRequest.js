import { getIsDraft } from "./editorContext";

/**
 * Gets the request return state (success or failed).
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current request return state.
 */
export function getWincherRequestIsSuccess( state ) {
	return state.WincherRequest.isSuccess;
}

/**
 * Gets the request response.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} Current request response.
 */
export function getWincherRequestResponse( state ) {
	return state.WincherRequest.response;
}

/**
 * Gets the request limit reached boolean.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current request limit reached boolean.
 */
export function getWincherKeyphraseLimitReached( state ) {
	return state.WincherRequest.limitReached;
}

/**
 * Gets the user logged in to Wincher status.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether or not the user is logged in to Wincher.
 */
export function getWincherLoginStatus( state ) {
	return state.WincherRequest.isLoggedIn;
}

/**
 * Gets the newly authenticated to Wincher status.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether the user is a newly authenticated account.
 */
export function isWincherNewlyAuthenticated( state ) {
	return state.WincherRequest.isNewlyAuthenticated;
}

/**
 * Gets the tracking limit.
 *
 * @param {Object} state The state.
 *
 * @returns {int} The trackg limit assigned to the user account.
 */
export function getWincherLimit( state ) {
	return state.WincherRequest.limit;
}

/**
 * Determines whether all keyphrases should be tracked.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether all keyphrases should be tracked.
 */
export function shouldWincherTrackAll( state ) {
	return state.WincherRequest.trackAll === true;
}

/**
 * Determines whether all keyphrases should automatically be tracked.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether all keyphrases should automatically be tracked.
 */
export function shouldWincherAutomaticallyTrackAll( state ) {
	return state.WincherRequest.automaticallyTrack && getIsDraft( state );
}

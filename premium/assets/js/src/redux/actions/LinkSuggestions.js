/*
 * Action types
 */

export const LOAD_LINK_SUGGESTIONS = "LOAD_LINK_SUGGESTIONS";
export const SET_LINK_SUGGESTIONS = "SET_LINK_SUGGESTIONS";
export const SET_LINK_SUGGESTIONS_ERROR = "SET_LINK_SUGGESTIONS_ERROR";

/*
 * Action creators
 */

/**
 * An action creator for the get link suggestions request action.
 *
 * @returns {Object} A get link suggestions action.
 */
export function loadLinkSuggestions() {
	return {
		type: LOAD_LINK_SUGGESTIONS,
	};
}

/**
 * An action creator for the get link suggestions success action.
 *
 * @param {Object} linkSuggestions The linkSuggestions json object
 *
 * @returns {Object} A get link suggestions success action.
 */
export function setLinkSuggestions( linkSuggestions, showUnindexedWarning ) {
	return {
		type: SET_LINK_SUGGESTIONS,
		linkSuggestions,
		showUnindexedWarning,
	};
}

/**
 * An action creator for the get link suggestions failure action.
 *
 * @param {string} message The error message that was returned.
 *
 * @returns {Object} A get link suggestions failure action.
 */
export function setLinkSuggestionsError( message ) {
	return {
		type: SET_LINK_SUGGESTIONS_ERROR,
		message,
	};
}

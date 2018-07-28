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
 * An action creator for the load link suggestions action.
 *
 * @returns {Object} A load link suggestions action.
 */
export function loadLinkSuggestions() {
	return {
		type: LOAD_LINK_SUGGESTIONS,
	};
}

/**
 * An action creator for the set link suggestions action.
 *
 * @param {Object} linkSuggestions The linkSuggestions json object
 *
 * @returns {Object} A set link suggestions action.
 */
export function setLinkSuggestions( linkSuggestions, showUnindexedWarning ) {
	return {
		type: SET_LINK_SUGGESTIONS,
		linkSuggestions,
		showUnindexedWarning,
	};
}

/**
 * An action creator for the set link suggestions error action.
 *
 * @param {string} message The error message that was returned.
 *
 * @returns {Object} A set link suggestions error action.
 */
export function setLinkSuggestionsError( message ) {
	return {
		type: SET_LINK_SUGGESTIONS_ERROR,
		message,
	};
}

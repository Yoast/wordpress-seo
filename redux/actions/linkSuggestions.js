const PREFIX = "LINK_SUGGESTIONS_";

export const SET_LINK_SUGGESTIONS = `${ PREFIX }SET_LINK_SUGGESTIONS`;

/*
 * Action creators.
 */

/**
 * An action creator for setting the link suggestions.
 *
 * @param {Array} linkSuggestions The link suggestions for the text.
 *
 * @returns {Object} A set link suggestions action.
 */
export function setLinkSuggestions( linkSuggestions ) {
	return {
		type: SET_LINK_SUGGESTIONS,
		linkSuggestions,
	};
}

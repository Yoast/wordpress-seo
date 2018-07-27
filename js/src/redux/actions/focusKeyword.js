const PREFIX = "WPSEO_";

export const SET_FOCUS_KEYWORD = `${ PREFIX }SET_ACTIVE_KEYWORD`;

/**
 * An action creator for setting the focus keyword.
 *
 * @param {string} keyword The focus keyword.
 *
 * @returns {Object} Action.
 */
export const setFocusKeyword = function( keyword ) {
	return {
		type: SET_FOCUS_KEYWORD,
		keyword: keyword,
	};
};

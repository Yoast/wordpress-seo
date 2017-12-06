const PREFIX = "WPSEO_";

export const SET_ACTIVE_KEYWORD = `${ PREFIX }SET_ACTIVE_KEYWORD`;

/**
 * An action creator for setting the active keyword.
 *
 * @param {string} keyword The active keyword.
 *
 * @returns {Object} Action.
 */
export const setActiveKeyword = function( keyword ) {
	return {
		type: SET_ACTIVE_KEYWORD,
		keyword: keyword,
	};
};

const PREFIX = "WPSEO_";

export const SET_KEYWORDS = `${ PREFIX }SET_KEYWORDS`;
export const ADD_KEYWORD = `${ PREFIX }ADD_KEYWORD`;
export const REMOVE_KEYWORD = `${ PREFIX }REMOVE_KEYWORD`;

/**
 * An action creator for setting all the keywords in one go.
 *
 * @param {Array} keywords The new keywords.
 *
 * @returns {Object} Action.
 */
export const setKeywords = function( keywords ) {
	return {
		type: SET_KEYWORDS,
		keywords,
	};
};

/**
 * An action creator for adding a keyword at a certain index. The default is to append it.
 *
 * @param {String}  keyword The new keyword.
 * @param {Integer} index   The index to insert at.
 *
 * @returns {Object} Action.
 */
export const addKeyword = function( keyword, index = -1 ) {
	return {
		type: ADD_KEYWORD,
		keyword,
		index,
	};
};

/**
 * An action creator for removing a keyword at a certain index.
 *
 * @param {String} keyword The keyword to remove.
 *
 * @returns {Object} Action.
 */
export const removeKeyword = function( keyword ) {
	return {
		type: REMOVE_KEYWORD,
		keyword,
	};
};

const PREFIX = "WPSEO_";

export const TOGGLE_CORNERSTONE_CONTENT = `${ PREFIX }TOGGLE_CORNERSTONE_CONTENT`;
export const SET_CORNERSTONE_CONTENT = `${ PREFIX }SET_CORNERSTONE_CONTENT`;

/**
 * An action creater for setting the cornerstone content toggle.
 *
 * @param {boolean} isCornerstone Whether or not the article is a cornerstone article.
 *
 * @return {Object} The set cornerstone content action.
 */
export const setCornerstoneContent = function( isCornerstone ) {
	return {
		type: SET_CORNERSTONE_CONTENT,
		isCornerstone,
	}
}

/**
 * An action creator for toggling whether the current item is cornerstone content or not.
 *
 * @returns {Object} The toggle cornerstone content action.
 */
export const toggleCornerstoneContent = function() {
	return {
		type: TOGGLE_CORNERSTONE_CONTENT,
	};
};

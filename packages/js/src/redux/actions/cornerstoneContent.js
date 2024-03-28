const PREFIX = "WPSEO_";

export const LOAD_CORNERSTONE_CONTENT = `${ PREFIX }LOAD_CORNERSTONE_CONTENT`;
export const TOGGLE_CORNERSTONE_CONTENT = `${ PREFIX }TOGGLE_CORNERSTONE_CONTENT`;
export const SET_CORNERSTONE_CONTENT = `${ PREFIX }SET_CORNERSTONE_CONTENT`;

/**
 * An action creator for setting the cornerstone content toggle.
 *
 * @param {boolean} isCornerstone Whether or not the article is a cornerstone article.
 *
 * @returns {Object} The set cornerstone content action.
 */
export const setCornerstoneContent = ( isCornerstone ) => {
	return {
		type: SET_CORNERSTONE_CONTENT,
		isCornerstone,
	};
};

/**
 * An action creator for toggling whether the current item is cornerstone content or not.
 *
 * @returns {Object} The toggle cornerstone content action.
 */
export const toggleCornerstoneContent = () => {
	return {
		type: TOGGLE_CORNERSTONE_CONTENT,
	};
};

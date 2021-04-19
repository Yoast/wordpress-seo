import AnalysisFields from "../../helpers/fields/AnalysisFields";

const PREFIX = "WPSEO_";

export const LOAD_CORNERSTONE_CONTENT = `${ PREFIX }LOAD_CORNERSTONE_CONTENT`;
export const TOGGLE_CORNERSTONE_CONTENT = `${ PREFIX }TOGGLE_CORNERSTONE_CONTENT`;
export const SET_CORNERSTONE_CONTENT = `${ PREFIX }SET_CORNERSTONE_CONTENT`;

/**
 * An action creator for loading the cornerstone content.
 *
 * @returns {Object} The load cornerstone content action.
 */
export const loadCornerstoneContent = () => {
	return {
		type: SET_CORNERSTONE_CONTENT,
		isCornerstone: AnalysisFields.isCornerstone,
	};
};

/**
 * An action creator for setting the cornerstone content toggle.
 *
 * @param {boolean} isCornerstone Whether or not the article is a cornerstone article.
 *
 * @returns {Object} The set cornerstone content action.
 */
export const setCornerstoneContent = ( isCornerstone ) => {
	AnalysisFields.isCornerstone = isCornerstone;
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
	AnalysisFields.isCornerstone = ! AnalysisFields.isCornerstone;
	return {
		type: TOGGLE_CORNERSTONE_CONTENT,
	};
};

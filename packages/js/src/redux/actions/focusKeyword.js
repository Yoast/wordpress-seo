import AnalysisFields from "../../helpers/fields/AnalysisFields";

const PREFIX = "WPSEO_";

export const LOAD_FOCUS_KEYWORD = `${ PREFIX }LOAD_FOCUS_KEYWORD`;
export const SET_FOCUS_KEYWORD = `${ PREFIX }SET_FOCUS_KEYWORD`;

/**
 * Loads the focus keyphrase.
 *
 * @returns {object} The action object.
 */
export const loadFocusKeyword = () => {
	return {
		type: LOAD_FOCUS_KEYWORD,
		keyword: AnalysisFields.keyphrase,
	};
};

/**
 * An action creator for setting the focus keyword.
 *
 * @param {string} keyword The focus keyword.
 *
 * @returns {Object} Action.
 */
export const setFocusKeyword = function( keyword ) {
	AnalysisFields.keyphrase = keyword;
	return {
		type: SET_FOCUS_KEYWORD,
		keyword: keyword,
	};
};

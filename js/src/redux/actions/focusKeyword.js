import SearchMetadataFields from "../../helpers/fields/SearchMetadataFields";

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
		keyword: SearchMetadataFields.keyphrase,
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
	SearchMetadataFields.keyphrase = keyword;
	return {
		type: SET_FOCUS_KEYWORD,
		keyword: keyword,
	};
};

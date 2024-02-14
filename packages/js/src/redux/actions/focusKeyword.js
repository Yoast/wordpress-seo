import MetaboxFieldSync from "../../helpers/fields/MetaboxFieldSync";

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
		keyword: MetaboxFieldSync.getInitialValue( "focuskw" ),
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
	MetaboxFieldSync.setFieldValue( "focuskw", keyword );
	return {
		type: SET_FOCUS_KEYWORD,
		keyword: keyword,
	};
};

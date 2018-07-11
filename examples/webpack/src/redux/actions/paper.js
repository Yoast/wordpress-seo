export const SET_PAPER = "WPSEOJS_SET_PAPER";
export const SET_PAPER_ATTRIBUTE = "WPSEOJS_SET_PAPER_ATTRIBUTE";

/**
 * An action creator for setting the paper.
 *
 * @param {string} paper The paper.
 *
 * @returns {Object} The action.
 */
export const setPaper = function( paper ) {
	return {
		type: SET_PAPER,
		paper,
	};
};

/**
 * An action creator for setting a paper attribute.
 *
 * @param {string} name  The name of the attribute.
 * @param {string} value The value of the attribute.
 *
 * @returns {Object} The action.
 */
export const setPaperAttribute = function( name, value ) {
	return {
		type: SET_PAPER_ATTRIBUTE,
		name,
		value,
	};
};

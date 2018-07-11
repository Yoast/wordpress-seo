export const SET_PAPER = "WPSEOJS_SET_PAPER";

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

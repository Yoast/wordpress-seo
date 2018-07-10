/*
 * Action types
 */
const prefix = "INSIGHTS_";

export const SET_PROMINENT_WORDS = `${ prefix }SET_PROMINENT_WORDS`;

/*
 * Action creators
 */

/**
 * An action creator for setting the prominent words.
 *
 * @param {array} prominentWords The prominent words.
 *
 * @returns {Object} A set prominent words action.
 */
export function setProminentWords( prominentWords ) {
	return {
		type: SET_PROMINENT_WORDS,
		prominentWords: prominentWords,
	};
}

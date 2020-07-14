export const ADD_KEYPHRASE = "ADD_KEYPHRASE";
export const REMOVE_KEYPHRASE = "REMOVE_KEYPHRASE";
export const SET_KEYPHRASE_LIMIT_REACHED = "SET_LIMIT_REACHED";

/**
 * An action creator for adding a new keyphrase.
 *
 * @param {string} The keyphrase to add.
 *
 * @returns {Object} Action object.
 */
export function SEMrushAddKeyphrase( keyphrase ) {
	return {
		type: ADD_KEYPHRASE,
		keyphrase,
	};
}

/**
 * An action creator for removing a keyphrase.
 *
 * @param {string} The keyphrase to remove.
 *
 * @returns {Object} Action object.
 */
export function SEMrushRemoveKeyphrase( keyphrase ) {
	return {
		type: REMOVE_KEYPHRASE,
		keyphrase,
	};
}

/**
 * An action creator for setting the keyphrase limit reached.
 *
 * @returns {Object} Action object.
 */
export function setSEMrushKeyphraseLimitReached() {
	return {
		type: SET_KEYPHRASE_LIMIT_REACHED,
	};
}

const PREFIX = "WPSEO_";

export const SET_ACTIVE_MARKER = `${ PREFIX }SET_ACTIVE_MARKER`;

/**
 * Updates the active marker button id.
 *
 * @param {string} activeMarker The active marker button id.
 *
 * @returns {Object} An action for redux.
 */
export function setActiveMarker( activeMarker ) {
	return {
		type: SET_ACTIVE_MARKER,
		activeMarker,
	};
}

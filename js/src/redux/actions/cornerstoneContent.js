const PREFIX = "WPSEO_";

export const TOGGLE_CORNERSTONE_CONTENT = `${ PREFIX }TOGGLE_CORNERSTONE_CONTENT`;

/**
 * An action creator for toggling whether the current item is cornerstone content or not.
 *
 * @returns {Object} The toggle cornerstone content action.
 */
export const toggleCornerstoneContent = function() {
	return {
		type: TOGGLE_CORNERSTONE_CONTENT,
	};
};

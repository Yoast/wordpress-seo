export const SET_SETTINGS = "SET_SETTINGS";

/**
 * An action creator for settings.
 *
 * @param {Object} settings The settings to pass along.
 *
 * @returns {Object} The set settings action.
 */
export const setSettings = function( settings ) {
	return {
		type: SET_SETTINGS,
		settings,
	};
};

export const SET_SETTINGS = "SET_SETTINGS";
export const SET_CONTENT_IMAGE = "SET_CONTENT_IMAGE";
export const SET_ELEMENTOR_TARGET = "SET_ELEMENTOR_TARGET";

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

/**
 * An action creator for the content image.
 *
 * @param {string} imageSrc The source of the content image.
 *
 * @returns {Object} The set content image action.
 */
export const setContentImage = function( imageSrc ) {
	return {
		type: SET_CONTENT_IMAGE,
		src: imageSrc,
	};
};

/**
 * An action creator for the elementor target.
 *
 * @param {string} target The elementor target.
 *
 * @returns {Object} The set elementor target action.
 */
export const setElementorTarget = function( target ) {
	return {
		type: SET_ELEMENTOR_TARGET,
		target,
	};
};

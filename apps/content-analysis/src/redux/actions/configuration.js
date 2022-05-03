export const SET_CONFIGURATION = "SET_CONFIGURATION";
export const SET_CONFIGURATION_ATTRIBUTE = "SET_CONFIGURATION_ATTRIBUTE";

/**
 * An action creator for setting the configuration.
 *
 * @param {string} configuration The configuration.
 *
 * @returns {Object} The action.
 */
export const setConfiguration = function( configuration ) {
	return {
		type: SET_CONFIGURATION,
		configuration,
	};
};

/**
 * An action creator for setting a configuration attribute.
 *
 * @param {string} name  The name of the attribute.
 * @param {string} value The value of the attribute.
 *
 * @returns {Object} The action.
 */
export const setConfigurationAttribute = function( name, value ) {
	return {
		type: SET_CONFIGURATION_ATTRIBUTE,
		name,
		value,
	};
};

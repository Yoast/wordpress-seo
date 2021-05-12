export const SET_OPTIONS = "SET_OPTIONS";
export const SET_OPTION = "SET_OPTION";

/**
 * An action creator for setting the options.
 *
 * @param {string} options The options.
 *
 * @returns {Object} The action.
 */
export const setOptions = function( options ) {
	return {
		type: SET_OPTIONS,
		options,
	};
};

/**
 * An action creator for setting an option.
 *
 * @param {string} name  The name of the option.
 * @param {string} value The value of the option.
 *
 * @returns {Object} The action.
 */
export const setOption = function( name, value ) {
	return {
		type: SET_OPTION,
		name,
		value,
	};
};

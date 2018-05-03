export const SWITCH_MODE = "SNIPPET_EDITOR_SWITCH_MODE";
export const UPDATE_DATA = "SNIPPET_EDITOR_UPDATE_DATA";
export const UPDATE_REPLACEMENT_VARIABLE = "SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE";
export const INSERT_REPLACEMENT_VARIABLE = "SNIPPET_EDITOR_INSERT_REPLACEMENT_VARIABLE";
export const SET_REPLACEMENT_VARIABLES = "SNIPPET_EDITOR_SET_REPLACEMENT_VARIABLES";

/**
 * Switches mode of the snippet editor.
 *
 * @param {string} mode The mode the snippet editor should be in.
 *
 * @returns {Object} An action for redux.
 */
export function switchMode( mode ) {
	return {
		type: SWITCH_MODE,
		mode,
	};
}

/**
 * Updates the data of the snippet editor.
 *
 * @param {Object} data             The snippet editor data.
 * @param {string} data.title       The title in the snippet editor.
 * @param {string} data.slug        The slug in the snippet editor.
 * @param {string} data.description The description in the snippet editor.
 *
 * @returns {Object} An action for redux.
 */
export function updateData( data ) {
	return {
		type: UPDATE_DATA,
		data,
	};
}

/**
 * Updates replacement variables in redux.
 *
 * @param {string} name  The name of the replacement variable.
 * @param {string} value The value of the replacement variable.
 *
 * @returns {Object} An action for redux.
 */
export function updateReplacementVariable( name, value ) {
	return {
		type: UPDATE_REPLACEMENT_VARIABLE,
		name,
		value,
	};
}

/**
 * Inserts replacement variables in redux.
 *
 * @param {string} name  The name of the replacement variable.
 * @param {string} value The value of the replacement variable.
 *
 * @returns {Object} An action for redux.
 */
export function insertReplacementVariable( name, value ) {
	return {
		type: INSERT_REPLACEMENT_VARIABLE,
		name,
		value,
	};
}

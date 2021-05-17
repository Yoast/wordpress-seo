import { decodeHTML } from "@yoast/helpers";

export const SWITCH_MODE = "SNIPPET_EDITOR_SWITCH_MODE";
export const UPDATE_DATA = "SNIPPET_EDITOR_UPDATE_DATA";
export const UPDATE_REPLACEMENT_VARIABLE = "SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE";
export const REMOVE_REPLACEMENT_VARIABLE = "SNIPPET_EDITOR_REMOVE_REPLACEMENT_VARIABLE";
export const REFRESH = "SNIPPET_EDITOR_REFRESH";
export const UPDATE_WORDS_TO_HIGHLIGHT = "SNIPPET_EDITOR_UPDATE_WORDS_TO_HIGHLIGHT";
export const LOAD_SNIPPET_EDITOR_DATA = "LOAD_SNIPPET_EDITOR_DATA";

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
 * @param {Object} data               The snippet editor data.
 * @param {string} [data.title]       The title in the snippet editor.
 * @param {string} [data.slug]        The slug in the snippet editor.
 * @param {string} [data.description] The description in the snippet editor.
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
 * @param {string} label The label of the replacement variable (optional).
 *
 * @returns {Object} An action for redux.
 */
export function updateReplacementVariable( name, value, label = "" ) {
	const unescapedValue = ( typeof value === "string" )
		? decodeHTML( value )
		: value;
	return {
		type: UPDATE_REPLACEMENT_VARIABLE,
		name,
		value: unescapedValue,
		label,
	};
}

/**
 * Updates the words to highlight in the snippet editor.
 *
 * @param {Array} wordsToHighlight  The snippet editor keyword forms.
 *
 * @returns {Object} An action for redux.
 */
export function updateWordsToHighlight( wordsToHighlight ) {
	return {
		type: UPDATE_WORDS_TO_HIGHLIGHT,
		wordsToHighlight,
	};
}

/**
 * Removes a replacement variable in redux.
 *
 * @param {string} name  The name of the replacement variable.
 *
 * @returns {Object} An action for redux.
 */
export function removeReplacementVariable( name ) {
	return {
		type: REMOVE_REPLACEMENT_VARIABLE,
		name,
	};
}

/**
 * Sets the time in redux, so that the snippet editor will refresh.
 *
 * @returns {Object} An action for redux.
 */
export function refreshSnippetEditor() {
	return {
		type: REFRESH,
		time: ( new Date() ).getMilliseconds(),
	};
}

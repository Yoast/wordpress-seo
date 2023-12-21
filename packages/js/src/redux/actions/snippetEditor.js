import { decodeHTML } from "@yoast/helpers";

export const SWITCH_MODE = "SNIPPET_EDITOR_SWITCH_MODE";
export const UPDATE_DATA = "SNIPPET_EDITOR_UPDATE_DATA";
export const FIND_CUSTOM_FIELDS = "SNIPPET_EDITOR_FIND_CUSTOM_FIELDS";
export const CUSTOM_FIELD_RESULTS = "SNIPPET_EDITOR_CUSTOM_FIELD_RESULTS";
export const UPDATE_REPLACEMENT_VARIABLE = "SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE";
export const UPDATE_REPLACEMENT_VARIABLES_BATCH = "SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLES_BATCH";
export const HIDE_REPLACEMENT_VARIABLES = "SNIPPET_EDITOR_HIDE_REPLACEMENT_VARIABLES";
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
 * Triggers a control to fetch new replacement variables from the API and then adds them.
 *
 * @param {string} query  The search query.
 * @param {int}    postId The post ID.
 *
 * @returns {Object} An action for redux.
 */
export function* findCustomFields( query, postId ) {
	const results = yield{
		type: FIND_CUSTOM_FIELDS,
		query,
		postId,
	};

	return {
		type: CUSTOM_FIELD_RESULTS,
		results,
	};
}

/**
 * Updates replacement variables in redux.
 *
 * @param {string} name   The name of the replacement variable.
 * @param {string} value  The value of the replacement variable.
 * @param {string} label  The label of the replacement variable (optional).
 * @param {bool}   hidden Should the replacement variable be searchable in the replacement variable editor.
 *
 * @returns {Object} An action for redux.
 */
export function updateReplacementVariable( name, value, label = "", hidden = false ) {
	const unescapedValue = ( typeof value === "string" )
		? decodeHTML( value )
		: value;
	return {
		type: UPDATE_REPLACEMENT_VARIABLE,
		name,
		value: unescapedValue,
		label,
		hidden,
	};
}

/**
 * Updates replacement variables in redux.
 *
 * @param {object} updatedVariables   The object containing all the replacement variables.
 *
 * @returns {Object} An action for redux.
 */
export function updateReplacementVariablesBatch( updatedVariables ) {
	return {
		type: UPDATE_REPLACEMENT_VARIABLES_BATCH,
		updatedVariables,
	};
}

/**
 * Updates the words to highlight in the snippet editor.
 *
 * @param {Array} wordsToHighlight The snippet editor keyword forms.
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

/**
 * Removes a replacement variable in redux.
 *
 * @param {array} replacementVariableNamesToBeHidden An array or replacement variables names that should be hidden in the replacement variable editor.
 *
 * @returns {Object} An action for redux.
 */
export function hideReplacementVariables( replacementVariableNamesToBeHidden ) {
	return {
		type: HIDE_REPLACEMENT_VARIABLES,
		data: replacementVariableNamesToBeHidden,
	};
}

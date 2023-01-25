export const SET_SETTINGS = "SET_SETTINGS";
export const SET_CONTENT_IMAGE = "SET_CONTENT_IMAGE";
export const UPDATE_SETTINGS = "UPDATE_SNIPPET_EDITOR_SETTINGS";

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
 * Updates the settings for snippet editor.
 *
 * @param {Object} snippetEditorSetting               The settings data.
 * @param {string} [snippetEditorSetting.baseUrl]       The baseUrl.
 *
 * @returns {Object} An action for redux.
 */
export const updateSettings = function( snippetEditorSetting ) {
	return {
		type: UPDATE_SETTINGS,
		snippetEditor: snippetEditorSetting,
	};
};

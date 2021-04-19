import { get } from "lodash";

/**
 * Gets the replacementVariables from the state.
 *
 * @param {Object} state The state object.
 *
 * @returns {Object[]} The replacementVariables.
 */
export const getReplaceVars = state => get( state, "snippetEditor.replacementVariables", [] );

/**
 * Gets the snippet editor templates.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor templates.
 */
export const getSnippetEditorTemplates = state => get( state, "snippetEditor.templates", {
	title: "",
	description: "",
} );

/**
 * Gets the snippet editor mode.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor mode.
 */
export const getSnippetEditorMode = state => get( state, "snippetEditor.mode", "mobile" );

/**
 * Gets the snippet editor title.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor title.
 */
export const getSnippetEditorTitle = state => get( state, "snippetEditor.data.title", "" );

/**
 * Gets the snippet editor title and the template. Falls back to the title template.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor title.
 */
export const getSnippetEditorTitleWithTemplate = state => get( state, "snippetEditor.data.title", "" ) || getSnippetEditorTemplates( state ).title;

/**
 * Gets the snippet editor description.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor description.
 */
export const getSnippetEditorDescription = state => get( state, "snippetEditor.data.description", "" );

/**
 * Gets the snippet editor and the template. If description is empty, falls back to template.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor description.
 */
export const getSnippetEditorDescriptionWithTemplate = state => {
	return getSnippetEditorDescription( state ) || getSnippetEditorTemplates( state ).description;
};

/**
 * Gets the snippet editor slug.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor slug.
 */
export const getSnippetEditorSlug = state => get( state, "snippetEditor.data.slug", "" );

/**
 * Gets the snippet editor data.
 *
 * @param {Object} state The state object.
 *
 * @returns {Object} The snippet editor data.
 */
export const getSnippetEditorData = state => get( state, "snippetEditor.data", {
	title: getSnippetEditorTitle( state ),
	description: getSnippetEditorDescription( state ),
	slug: getSnippetEditorSlug( state ),
} );

/**
 * Gets the snippet editor words to highlight.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor words to highlight.
 */
export const getSnippetEditorWordsToHighlight = state => get( state, "snippetEditor.wordsToHighlight", [] );

/**
 * Gets the snippet editor is loading.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Whether the snippet editor is loading.
 */
export const getSnippetEditorIsLoading = state => get( state, "snippetEditor.isLoading", true );

/**
 * Gets the snippet editor preview image URL.
 *
 * @param {Object} state The state object.
 *
 * @returns {Object} The snippet editor preview image URL.
 */
export const getSnippetEditorPreviewImageUrl = state => get( state, "snippetEditor.data.snippetPreviewImageURL", "" );

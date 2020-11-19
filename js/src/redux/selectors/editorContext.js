import { get } from "lodash";

/**
 * Gets the editor context.
 *
 * @param {Object} state    The state.
 *
 * @returns {string} the editor context.
 */
export function getEditorContext( state ) {
	return state.editorContext;
}

/**
 * Returns whether your or on a page or post.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Whether this is a page or a post editor.
 */
export function getPostOrPageString( state ) {
	return get( state, "editorContext.postTypeNameSingular" ) === "Page" ? "page" : "post";
}

/**
 * Gets the content locale.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The content locale.
 */
export function getContentLocale( state ) {
	return get( state, "editorContext.contentLocale", "en_US" );
}

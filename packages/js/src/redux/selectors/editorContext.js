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
 * Returns whether this is the block editor or not.
 *
 * @param {Object} state The state.
 *
 * @returns {Boolean} Whether this is a block editor.
 */
export function getIsBlockEditor( state ) {
	return get( state, "editorContext.isBlockEditor", false );
}

/**
 * Returns whether this is the elementor editor or not.
 *
 * @param {Object} state The state.
 *
 * @returns {Boolean} Whether this is an elementor editor.
 */
export function getIsElementorEditor( state ) {
	return get( state, "editorContext.isElementorEditor", false );
}

/**
 * Returns whether this is the taxonomy editor or not.
 *
 * @param {Object} state The state.
 *
 * @returns {Boolean} Whether this is a taxonomy editor.
 */
export function getIsTerm( state ) {
	return get( state, "editorContext.isTerm", false );
}

/**
 * Returns whether this is a draft post or not.
 *
 * @param {Object} state The state.
 *
 * @returns {Boolean} Whether this is a draft post.
 */
export function getIsDraft( state ) {
	return [ "draft", "auto-draft" ].includes( get( state, "editorContext.postStatus", "" ) );
}

/**
 * Returns which type of editor this is.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The current editor type.
 */
export function getEditorType( state ) {
	if ( getIsElementorEditor( state ) ) {
		return "elementorEditor";
	}
	if ( getIsBlockEditor( state ) ) {
		return "blockEditor";
	}
	return "classicEditor";
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

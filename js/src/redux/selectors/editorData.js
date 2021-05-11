import { get } from "lodash";
import { excerptFromContent } from "../../helpers/replacementVariableHelpers";

/**
 * Gets the content.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The content.
 */
export const getEditorDataContent = state => get( state, "editorData.content", "" );

/**
 * Gets the title.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The title.
 */
export const getEditorDataTitle = state => get( state, "editorData.title", "" );

/**
 * Gets the excerpt.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The excerpt.
 */
export const getEditorDataExcerpt = state => get( state, "editorData.excerpt" );

/**
 * Gets the excerpt with fallback to the excerpt from the content.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The excerpt with fallback to the excerpt from the content.
 */
export const getEditorDataExcerptWithFallback = ( state ) => {
	let excerpt = get( state, "editorData.excerpt", "" );

	// Fallback to the first piece of the content.
	if ( excerpt === "" ) {
		excerpt = excerptFromContent( get( state, "editorData.content", "" ) );
	}

	return excerpt;
};

/**
 * Gets the image URL.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The image URL.
 */
export const getEditorDataImageUrl = state => get( state, "editorData.imageUrl", "" );

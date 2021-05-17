import { get } from "lodash";

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
 * Gets the image URL.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The image URL.
 */
export const getEditorDataImageUrl = state => get( state, "editorData.imageUrl", "" );

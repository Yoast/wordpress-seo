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
 * Gets the slug.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The slug.
 */
export const getEditorDataSlug = state => get( state, "editorData.slug", "" );

import { select } from "@wordpress/data";
import { EDITOR_STORE } from "../../shared-admin/constants";

/**
 * Gets the snippet editor title.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor title.
 */
export const getSeoTitle = () => select( EDITOR_STORE )?.getSnippetEditorTitle();

/**
 * Gets the snippet editor description.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor description.
 */
export const getSeoDescription = () => select( EDITOR_STORE )?.getSnippetEditorDescription();

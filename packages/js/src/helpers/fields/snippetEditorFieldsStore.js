import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";

/**
 * Gets the snippet editor title from the store.
 *
 * @returns {string} The snippet editor title.
 */
export const getSeoTitle = () => select( STORE_NAME_EDITOR.free ).getSnippetEditorTitle();

/**
 * Gets the snippet editor description from the store.
 *
 * @returns {string} The snippet editor description.
 */
export const getSeoDescription = () => select( STORE_NAME_EDITOR.free ).getSnippetEditorDescription();

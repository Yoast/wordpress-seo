import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { defaultTo } from "lodash";

/**
 * Gets the snippet editor title from the store.
 *
 * @returns {string} The snippet editor title.
 */
export const getSeoTitle = () => defaultTo( select( STORE_NAME_EDITOR.free ).getSnippetEditorTitle(), "" );

/**
 * Gets the snippet editor description from the store.
 *
 * @returns {string} The snippet editor description.
 */
export const getSeoDescription = () => defaultTo( select( STORE_NAME_EDITOR.free ).getSnippetEditorDescription(), "" );

import { select } from "@wordpress/data";
import { EDITOR_STORE } from "../../shared-admin/constants";
import { defaultTo } from "lodash";

/**
 * Gets the snippet editor title from the store.
 *
 * @returns {string} The snippet editor title.
 */
export const getSeoTitle = () => defaultTo( select( EDITOR_STORE ).getSnippetEditorTitle(), "" );

/**
 * Gets the snippet editor description from the store.
 *
 * @returns {string} The snippet editor description.
 */
export const getSeoDescription = () => defaultTo( select( EDITOR_STORE ).getSnippetEditorDescription(), "" );

import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { defaultTo } from "lodash";

/**
 * Retrieve twitter image id from the store.
 *
 * @returns {string} The twitter image id.
 */
export const getTwitterImageId = () => String( defaultTo( select( STORE_NAME_EDITOR.free ).getTwitterImageId(), "" ) );

/**
 * Get twitter title from the store.
 *
 * @returns {string} The twitter title.
 */
export const getTwitterTitle = () => defaultTo( select( STORE_NAME_EDITOR.free ).getTwitterTitle(), "" );

/**
 * Get twitter description from the store.
 *
 * @returns {string} The twitter description.
 */
export const getTwitterDescription = () => defaultTo( select( STORE_NAME_EDITOR.free ).getTwitterDescription(), "" );

/**
 * Get twitter image Url from the store.
 *
 * @returns {string} The twitter image Url.
 */
export const getTwitterImageUrl = () => defaultTo( select( STORE_NAME_EDITOR.free ).getTwitterImageUrl(), "" );


import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";

/**
 * Retrieve twitter image id from the store.
 *
 * @returns {string} The twitter image id.
 */
export const getTwitterImageId = () => String( select( STORE_NAME_EDITOR.free ).getTwitterImageId() );

/**
 * Get twitter title from the store.
 *
 * @returns {string} The twitter title.
 */
export const getTwitterTitle = () => select( STORE_NAME_EDITOR.free ).getTwitterTitle();

/**
 * Get twitter description from the store.
 *
 * @returns {string} The twitter description.
 */
export const getTwitterDescription = () => select( STORE_NAME_EDITOR.free ).getTwitterDescription();

/**
 * Get twitter image Url from the store.
 *
 * @returns {string} The twitter image Url.
 */
export const getTwitterImageUrl = () => select( STORE_NAME_EDITOR.free ).getTwitterImageUrl();


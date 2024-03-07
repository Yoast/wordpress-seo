import { select } from "@wordpress/data";
import { EDITOR_STORE } from "../../shared-admin/constants";
import { defaultTo } from "lodash";

/**
 * Retrieve twitter image id from the store.
 *
 * @returns {string} The twitter image id.
 */
export const getTwitterImageId = () => String( defaultTo( select( EDITOR_STORE ).getTwitterImageId(), "" ) );

/**
 * Get twitter title from the store.
 *
 * @returns {string} The twitter title.
 */
export const getTwitterTitle = () => defaultTo( select( EDITOR_STORE ).getTwitterTitle(), "" );

/**
 * Get twitter description from the store.
 *
 * @returns {string} The twitter description.
 */
export const getTwitterDescription = () => defaultTo( select( EDITOR_STORE ).getTwitterDescription(), "" );

/**
 * Get twitter image Url from the store.
 *
 * @returns {string} The twitter image Url.
 */
export const getTwitterImageUrl = () => defaultTo( select( EDITOR_STORE ).getTwitterImageUrl(), "" );


import { select } from "@wordpress/data";
import { EDITOR_STORE } from "../../shared-admin/constants";

/**
 * Retrieve twitter image id.
 * @returns {integer} The twitter image id.
 */
export const getTwitterImageId = () => select( EDITOR_STORE )?.getTwitterImageId();

/**
 * Get twitter title.
 * @returns {string} The twitter title.
 */
export const getTwitterTitle = () => select( EDITOR_STORE )?.getTwitterTitle();

/**
 * Get twitter description.
 * @returns {string} The twitter description.
 */
export const getTwitterDescription = () => select( EDITOR_STORE )?.getTwitterDescription();

/**
 * Get twitter image Url.
 * @returns {string} The twitter image Url.
 */
export const getTwitterImageUrl = () => select( EDITOR_STORE )?.getTwitterImageUrl();


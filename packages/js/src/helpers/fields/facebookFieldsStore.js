import { select } from "@wordpress/data";
import { EDITOR_STORE } from "../../shared-admin/constants";

/**
 * Retrieve facebook image id.
 * @returns {integer} The facebook image id.
 */
export const getFacebookImageId = () => select( EDITOR_STORE )?.getFacebookImageId();

/**
 * Get facebook title.
 * @returns {string} The facebook title.
 */
export const getFacebookTitle = () => select( EDITOR_STORE )?.getFacebookTitle();

/**
 * Get facebook description.
 * @returns {string} The facebook description.
 */
export const getFacebookDescription = () => select( EDITOR_STORE )?.getFacebookDescription();

/**
 * Get facebook image Url.
 * @returns {string} The facebook image Url.
 */
export const getFacebookImageUrl = () => select( EDITOR_STORE )?.getFacebookImageUrl();


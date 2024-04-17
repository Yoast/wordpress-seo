import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";

/**
 * Retrieve facebook image id.
 * @returns {integer} The facebook image id.
 */
export const getFacebookImageId = () => String( select( STORE_NAME_EDITOR.free ).getFacebookImageId() );

/**
 * Get facebook title.
 * @returns {string} The facebook title.
 */
export const getFacebookTitle = () => select( STORE_NAME_EDITOR.free ).getFacebookTitle();

/**
 * Get facebook description.
 * @returns {string} The facebook description.
 */
export const getFacebookDescription = () => select( STORE_NAME_EDITOR.free ).getFacebookDescription();

/**
 * Get facebook image Url.
 * @returns {string} The facebook image Url.
 */
export const getFacebookImageUrl = () => select( STORE_NAME_EDITOR.free )?.getFacebookImageUrl();


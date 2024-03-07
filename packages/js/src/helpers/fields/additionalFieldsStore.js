import { select } from "@wordpress/data";
import { EDITOR_STORE } from "../../shared-admin/constants";

/**
 * Retrieves the estimated reading time from the store.
 * @returns {string} The estimated reading time.
 */
export const getEstimatedReadingTime = () => select( EDITOR_STORE ).getEstimatedReadingTime().toString();

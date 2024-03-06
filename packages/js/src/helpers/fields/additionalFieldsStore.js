import { select } from "@wordpress/data";
import { STORE } from "../../constants";

/**
 * Retrieves the estimated reading time from the store.
 * @returns {string} The estimated reading time.
 */
export const getEstimatedReadingTime = () => select( STORE ).getEstimatedReadingTime().toString();

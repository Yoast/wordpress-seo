import { select } from "@wordpress/data";
import { EDITOR_STORE } from "../../shared-admin/constants";
import { defaultTo } from "lodash";

/**
 * Retrieves the estimated reading time from the store.
 * @returns {string} The estimated reading time.
 */
export const getEstimatedReadingTime = () => String( defaultTo( select( EDITOR_STORE ).getEstimatedReadingTime(), "0" ) );

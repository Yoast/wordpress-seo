import { select } from "@wordpress/data";
import { STORE } from "../../constants";

/**
 * Retrieves the focus keyphrase.
 * @returns {string} The focus keyphrase.
 */
export const getFocusKeyphrase = () => select( STORE )?.getFocusKeyphrase();

import { select } from "@wordpress/data";
import { STORE } from "../../constants";

/**
 * Retrieves the focus keyphrase.
 * @returns {string} The focus keyphrase.
 */
export const getFocusKeyphrase = () => select( STORE )?.getFocusKeyphrase();

/**
 * Returns whether the current content is cornerstone content.
 *
 * @returns {string} Whether the current content is cornerstone content.
 */
export const isCornerstoneContent = () => select( STORE )?.isCornerstoneContent() ? "1" : "0";

/**
 * Retrieves the content score.
 *
 * @returns {string} The content score.
 */
export const getContentScore = () => String( select( STORE )?.getContentScore() );

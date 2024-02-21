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
 * Retrieves the readability score.
 *
 * @returns {string} The content score.
 */
export const getReadabilityScore = () => String( select( STORE )?.getReadabilityResults()?.overallScore );

/**
 * Retrieves the inclusive language score.
 *
 * @returns {string} The content score.
 */
export const getInclusiveLanguageScore = () => String( select( STORE )?.getInclusiveLanguageResults()?.overallScore );

/**
 * Retrieves the seo score.
 *
 * @returns {string} The content score.
 */
export const getSeoScore = () => String( select( STORE )?.getSeoResults().overallScore );

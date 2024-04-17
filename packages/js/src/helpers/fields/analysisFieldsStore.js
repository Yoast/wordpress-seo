import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";
import { defaultTo } from "lodash";

/**
 * Retrieves the focus keyphrase from store.
 *
 * @returns {string} The focus keyphrase.
 */
export const getFocusKeyphrase = () => defaultTo( select( STORE_NAME_EDITOR.free ).getFocusKeyphrase(), "" );

/**
 * Returns whether the current content is cornerstone content.
 *
 * @returns {string} Whether the current content is cornerstone content.
 */
export const isCornerstoneContent = () => select( STORE_NAME_EDITOR.free )?.isCornerstoneContent() ? "1" : "0";

/**
 * Retrieves the readability score from the store.
 *
 * @returns {string} The content score.
 */
export const getReadabilityScore = () => String( defaultTo( select( STORE_NAME_EDITOR.free ).getReadabilityResults().overallScore, "0" ) );

/**
 * Retrieves the inclusive language score from the store.
 *
 * @returns {string} The content score.
 */
export const getInclusiveLanguageScore = () => String( defaultTo( select( STORE_NAME_EDITOR.free ).getInclusiveLanguageResults().overallScore, "0" ) );

/**
 * Retrieves the seo score from the store.
 *
 * @returns {string} The content score.
 */
export const getSeoScore = () => String( defaultTo( select( STORE_NAME_EDITOR.free ).getSeoResults().overallScore, "0" ) );

/**
 * Retrieves the estimated reading time from the store.
 *
 * @returns {string} The estimated reading time.
 */
export const getEstimatedReadingTime = () => String( defaultTo( select( STORE_NAME_EDITOR.free ).getEstimatedReadingTime(), "0" ) );

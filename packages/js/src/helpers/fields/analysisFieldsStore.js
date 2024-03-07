import { select } from "@wordpress/data";
import { EDITOR_STORE } from "../../shared-admin/constants";
import { defaultTo } from "lodash";

/**
 * Retrieves the focus keyphrase.
 * @returns {string} The focus keyphrase.
 */
export const getFocusKeyphrase = () => defaultTo( select( EDITOR_STORE ).getFocusKeyphrase(), "" );

/**
 * Returns whether the current content is cornerstone content.
 *
 * @returns {string} Whether the current content is cornerstone content.
 */
export const isCornerstoneContent = () => select( EDITOR_STORE )?.isCornerstoneContent() ? "1" : "0";

/**
 * Retrieves the readability score.
 *
 * @returns {string} The content score.
 */
export const getReadabilityScore = () => select( EDITOR_STORE )?.getReadabilityResults()?.overallScore ? String( select( EDITOR_STORE )?.getReadabilityResults()?.overallScore ) : "";

/**
 * Retrieves the inclusive language score.
 *
 * @returns {string} The content score.
 */
export const getInclusiveLanguageScore = () => select( EDITOR_STORE )?.getInclusiveLanguageResults()?.overallScore ? String( select( EDITOR_STORE )?.getInclusiveLanguageResults()?.overallScore ) : "";

/**
 * Retrieves the seo score.
 *
 * @returns {string} The content score.
 */
export const getSeoScore = () => String( select( EDITOR_STORE ).getSeoResults().overallScore );

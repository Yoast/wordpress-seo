import { get } from "lodash";

/**
 * Gets the robots no-index from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The robots no-index.
 */
export const getNoIndex = state => get( state, "advancedSettings.noIndex", "0" );

/**
 * Gets the robots no-follow from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The robots no-follow.
 */
export const getNoFollow = state => get( state, "advancedSettings.noFollow", "0" );

/**
 * Gets the robots advanced settings from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string[]} The robots advanced settings.
 */
export const getAdvanced = state => get( state, "advancedSettings.advanced", [] );

/**
 * Gets the breadcrumbs title from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The breadcrumbs title
 */
export const getBreadcrumbsTitle = state => get( state, "advancedSettings.breadcrumbsTitle", "summary" );

/**
 * Gets the canonical from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The canonical.
 */
export const getCanonical = state => get( state, "advancedSettings.canonical", "" );

/**
 * Gets the WordProof timestamp value.
 *
 * @param {Object} state The state.
 *
 * @returns {Boolean} WordProof timestamp value.
 */
export const getWordProofTimestamp = state => get( state, "advancedSettings.wordproofTimestamp", false );

/** Gets whether the advanced settings is loading from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether the advanced settings is loading.
 */
export const getIsLoading = state => get( state, "advancedSettings.isLoading", true );

import { get } from "lodash";

/**
 * Gets the twitter title from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter title.
 */
export const getNoIndex = state => get( state, "advancedSettings.noIndex", "" );

/**
 * Gets the twitter description from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter description.
 */
export const getNoFollow = state => get( state, "advancedSettings.noFollow", "" );

/**
 * Gets the twitter image URL from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image URL.
 */
export const getAdvanced = state => get( state, "advancedSettings.advanced", "" );

/**
 * Gets the twitter image type from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image type.
 */
export const getBreadcrumbsTitle = state => get( state, "advancedSettings.breadcrumbsTitle", "summary" );

/**
 * Gets the Twitter image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image src.
 */
export const getCanonical = state => get( state, "advancedSettings.canonical", "" );

/**
 * Gets the Twitter image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image src.
 */
export const getTimestamp = state => get( state, "advancedSettings.timestamp", true );

/** Gets the Twitter image src from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} Twitter image src.
 */
export const getIsLoading = state => get( state, "advancedSettings.isLoading", true );

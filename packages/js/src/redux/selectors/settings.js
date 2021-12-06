import { get } from "lodash";

/**
 * Gets the siteName from the state.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The site name
 */
export const getSiteName = state => get( state, "settings.socialPreviews.siteName", "" );

/**
 * Gets the base URL from the settings.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The base URL.
 */
export const getBaseUrlFromSettings = state => get( state, "settings.snippetEditor.baseUrl", "" );

/**
 * Gets the date from the settings.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The date.
 */
export const getDateFromSettings = state => get( state, "settings.snippetEditor.date", "" );

/**
 * Gets the recommendedReplacementVariables from the state.
 *
 * @param {Object} state The state object.
 *
 * @returns {string[]} The recommendedReplacementVariables
 */
export const getRecommendedReplaceVars = state => get( state, "settings.snippetEditor.recommendedReplacementVariables", [] );

/**
 * Gets the site icon URL from the settings.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The site icon URL.
 */
export const getSiteIconUrlFromSettings = state => get( state, "settings.snippetEditor.siteIconUrl", "" );

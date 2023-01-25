import { get } from "lodash";

/**
 * Gets a preference.
 *
 * @param {Object} state The state object.
 * @param {string} path The path of the preference.
 * @param {*} fallback The fallback value.
 *
 * @returns {*} The preference or fallback value.
 */
export const getPreference = ( state, path, fallback = null ) => get( state, `preferences.${ path }`, fallback );

/**
 * Gets the preferences.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The preferences.
 */
export const getPreferences = state => state.preferences;

/**
 * Gets the isKeywordAnalysisActive.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} The isKeywordAnalysisActive.
 */
export const getIsKeywordAnalysisActive = state => get( state, "preferences.isKeywordAnalysisActive", false );

import { get } from "lodash";

/**
 * Gets the preferences.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The preferences.
 */
export function getPreferences( state ) {
	return state.preferences;
}

/**
 * Gets the isKeywordAnalysisActive.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} The isKeywordAnalysisActive.
 */
export function getIsKeywordAnalysisActive( state ) {
	return get( state, "preferences.isKeywordAnalysisActive", false );
}

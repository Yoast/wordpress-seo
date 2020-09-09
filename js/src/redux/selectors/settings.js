/**
 * Gets the settings from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The settings.
 */
export function getSettings( state ) {
	return state.settings;
}

/**
 * Gets the recommendedReplacementVariables from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The recommendedReplacementVariables.
 */
export const getRecommendedReplaceVars = state => state.settings.snippetEditor.recommendedReplacementVariables;

/**
 * Gets the baseUrl from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The baseUrl.
 */
export const getBaseUrlFromSettings = state => state.settings.snippetEditor.baseUrl;

/**
 * Gets the slug from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The slug.
 */
export const getSlugFromSettings = state => state.settings.snippetEditor.slug;

/**
 * Gets the elementorTarget from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The elementorTarget.
 */
export function getElementorTarget( state ) {
	return state.settings.elementorTarget;
}

/**
 * Gets the authorName from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The authorName.
 */
export const getAuthorName = state => state.settings.socialPreviews.authorName;

/**
 * Gets the siteName from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The siteName.
 */
export const getSiteName = state => state.settings.socialPreviews.siteName;

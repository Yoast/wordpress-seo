/**
 * Gets the recommendedReplacementVariables from the state.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The recommendedReplacementVariables
 */
export const getRecommendedReplaceVars = state => state.settings.snippetEditor.recommendedReplacementVariables;

/**
 * Gets the authorName from the state.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The authorName
 */
export const getAuthorName = state => state.settings.socialPreviews.authorName;

/**
 * Gets the siteName from the state.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The authorName
 */
export const getSiteName = state => state.settings.socialPreviews.siteName;

/**
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The fallback title.
 */
export const getTitleFallback = state => state.analysisData.snippet.title;

/**
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The fallback description.
 */
export const getDescriptionFallback = state => state.analysisData.snippet.description;

/**
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The fallback title.
 */
export const getImageUrlFallback = state => state.settings.socialPreviews.siteWideImage;

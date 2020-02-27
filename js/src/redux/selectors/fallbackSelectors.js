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
 * @returns {string} The sidewide image url.
 */
export const getSitewideImage = state => state.settings.socialPreviews.siteWideImage;

/**
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The featured image url.
 */
export const getFeaturedImage = state => state.snippetEditor.data.snippetPreviewImageURL;

/**
 * Gets the fallback title from: state.analysisData.snippet.title.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The fallback title.
 */
export const getTitleFallback = state => state.analysisData.snippet.title;

/**
 * Gets the fallback description from: state.analysisData.snippet.description.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The fallback description.
 */
export const getDescriptionFallback = state => state.analysisData.snippet.description;

/**
 * Gets the fallback image from:
 * state.settings.socialPreviews.siteWideImage
 * or
 * state.snippetEditor.data.snippetPreviewImageURL.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The sidewide image url.
 */
export const getImageFallback = state => state.settings.socialPreviews.siteWideImage || state.snippetEditor.data.snippetPreviewImageURL;

import { selectorsFactory } from "@yoast/social-metadata-forms";

const socialSelectors = selectorsFactory( "social" );

/**
 * Gets the fallback title from: state.analysisData.snippet.title.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The fallback title.
 */
const getTitleFallback = state => state.analysisData.snippet.title;

/**
 * Gets the fallback description from: state.analysisData.snippet.description.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The fallback description.
 */
const getDescriptionFallback = state => state.analysisData.snippet.description;

/**
 * Gets the fallback image from:
 * state.settings.socialPreviews.sitewideImage
 * or
 * state.snippetEditor.data.snippetPreviewImageURL.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The sidewide image url.
 */
const getImageFallback = state => state.settings.socialPreviews.sitewideImage || state.snippetEditor.data.snippetPreviewImageURL;

export default {
	...socialSelectors,
	getTitleFallback,
	getImageFallback,
	getDescriptionFallback,
};

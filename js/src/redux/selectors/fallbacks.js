import { get, find } from "lodash";

/**
 * Gets the fallback title that is equal to the site title.
 *
 * This is stored in:
 * state.snippetEditor.replacementVariables's value where the name is title.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The fallback title.
 */
export const getTitleFallback = state => {
	const replacementVariables = get( state, "snippetEditor.replacementVariables", {} );

	// The replacement variable for the term title is called term_title, rather than title.
	const isTerm = get( window, "wpseoScriptData.isTerm", false );
	const searchTitle = isTerm ? "term_title" : "title";

	const titleReplacementVariable = find( replacementVariables, [ "name", searchTitle ] );

	if ( titleReplacementVariable ) {
		return titleReplacementVariable.value;
	}

	return "";
};

/**
 * Gets the fallback description from: state.analysisData.snippet.description.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The fallback description.
 */
export const getDescriptionFallback = state => get( state, "analysisData.snippet.description", "" );

/**
 * Gets the first image from the content in Gutenberg.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The first content image src.
 */
export const getContentImage = state => {
	return get( state, "socialPreviews.contentImage", "" );
};

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
export const getImageFallback = state => {
	const featuredImage = get( state, "snippetEditor.data.snippetPreviewImageURL", "" );
	const contentImage = get( state, "settings.socialPreviews.contentImage", "" );
	const siteWideImage = get( window.wpseoScriptData, "metabox.showSocial.facebook" ) && get( state, "settings.socialPreviews.sitewideImage", "" );

	return featuredImage || contentImage || siteWideImage || "";
};

/**
 * Gets the site base URL from the analysisdata state. Then cuts it after the first "/".
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The authorName
 */
export const getSiteUrl = state => ( state.analysisData.snippet.url || "" ).split( "/" )[ 0 ];

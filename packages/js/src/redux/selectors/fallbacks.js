import { get } from "lodash";
import { applyFilters } from "@wordpress/hooks";

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
export const getTitleFallback = state => get( state, "analysisData.snippet.title", "" );

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
	const fallbacks = [
		{ featuredImage: get( state, "snippetEditor.data.snippetPreviewImageURL", "" ) },
		{ contentImage: get( state, "settings.socialPreviews.contentImage", "" ) },
		{ siteWideImage: get( window.wpseoScriptData, "metabox.showSocial.facebook" ) && get( state, "settings.socialPreviews.sitewideImage", "" ) },
	];

	applyFilters( "yoast.socials.imageFallback", fallbacks );

	for ( const fallback of fallbacks ) {
		if ( Object.values( fallback )[ 0 ] ) {
			return Object.values( fallback )[ 0 ];
		}
	}

	return "";
};

/**
 * Gets the site base URL from the analysisdata state. Then cuts it after the first "/".
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The authorName
 */
export const getSiteUrl = () => {
	let url = get( window, "wpseoScriptData.metabox.base_url", "" );
	if ( url === "" ) {
		return "";
	}
	url = new URL( url );
	return url.host;
};

import { get } from "lodash";
import { applyFilters } from "@wordpress/hooks";

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
 * Gets the site base URL. Then cuts it after the first "/".
 *
 * @returns {string} The authorName.
 */
export const getSiteUrl = () => {
	let url = get( window, "wpseoScriptData.metabox.base_url", "" );
	if ( url === "" ) {
		return "";
	}
	url = new URL( url );
	return url.host;
};

/**
 * Gets the SEO title template without fallback value.
 *
 * @returns {string} The SEO title template.
 */
export const getSeoTitleTemplate = () => get( window, "wpseoScriptData.metabox.title_template_no_fallback", "" );

/**
 * Gets the social title template.
 *
 * @returns {string} The social title template.
 */
export const getSocialTitleTemplate = () => get( window, "wpseoScriptData.metabox.social_title_template", "" );

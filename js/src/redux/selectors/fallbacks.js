import { get } from "lodash";
import { applyFilters } from "@wordpress/hooks";

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
 * @returns {string} The fallback image url.
 */
export const getImageFallback = state => {
	const fallbacks = [
		{ featuredImage: get( state, "snippetEditor.data.snippetPreviewImageURL", "" ) },
		{ contentImage: get( state, "settings.socialPreviews.contentImage", "" ) },
		{ socialImage: get( window, "wpseoScriptData.metabox.social_image_template", "" ) },
		{ siteWideImage: get( window, "wpseoScriptData.metabox.showSocial.facebook" ) && get( state, "settings.socialPreviews.sitewideImage", "" ) },
	];

	/*
	 * This filter is also applied to the `getEditorDataImageFallback` selector
	 * for the Elementor editor. It's then used in Yoast SEO WooCommerce, to add
	 * the first product gallery image to the fallback, before the `siteWideImage`.
	 */
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
 * Gets the SEO title template with the fallback value.
 *
 * @returns {string} The SEO title template with the fallback value.
 */
export const getSeoTitleTemplate = () => get( window, "wpseoScriptData.metabox.title_template", "" );

/**
 * Gets the SEO title template without fallback value.
 *
 * @returns {string} The SEO title template without fallback value.
 */
export const getSeoTitleTemplateNoFallback = () => get( window, "wpseoScriptData.metabox.title_template_no_fallback", "" );

/**
 * Gets the social title template.
 *
 * @returns {string} The social title template.
 */
export const getSocialTitleTemplate = () => get( window, "wpseoScriptData.metabox.social_title_template", "" );

/**
 * Gets the SEO description template.
 *
 * @returns {string} The SEO description template.
 */
export const getSeoDescriptionTemplate = () => get( window, "wpseoScriptData.metabox.metadesc_template", "" );

/**
 * Gets the social description template.
 *
 * @returns {string} The social description template.
 */
export const getSocialDescriptionTemplate = () => get( window, "wpseoScriptData.metabox.social_description_template", "" );

/**
 * Gets the excerpt replacement variable replaced value.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The excerpt replaced value.
 */
export const getReplacedExcerpt = ( state ) => {
	let replacedExcerpt = "";

	get( state, "snippetEditor.replacementVariables", [] ).forEach( ( replacementVariable ) => {
		// The "excerpt" replacement variable works for both posts and terms.
		if ( replacementVariable.name === "excerpt" ) {
			replacedExcerpt = replacementVariable.value;
		}
	} );

	return replacedExcerpt;
};

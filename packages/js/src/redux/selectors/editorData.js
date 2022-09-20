import { get } from "lodash";
import { applyFilters } from "@wordpress/hooks";
import getContentLocale from "../../analysis/getContentLocale";
import { excerptFromContent } from "../../helpers/replacementVariableHelpers";

/**
 * Gets the content.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The content.
 */
export const getEditorDataContent = state => get( state, "editorData.content", "" );

/**
 * Gets the title.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The title.
 */
export const getEditorDataTitle = state => get( state, "editorData.title", "" );

/**
 * Gets the excerpt.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The excerpt.
 */
export const getEditorDataExcerpt = state => get( state, "editorData.excerpt" );

/**
 * Gets the excerpt with fallback to the excerpt from the content.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The excerpt with fallback to the excerpt from the content.
 */
export const getEditorDataExcerptWithFallback = ( state ) => {
	let excerpt = get( state, "editorData.excerpt", "" );

	// Fallback to the first piece of the content.
	if ( excerpt === "" ) {
		const limit = ( getContentLocale() === "ja" ) ? 80 : 156;

		excerpt = excerptFromContent( get( state, "editorData.content", "" ), limit );
	}

	return excerpt;
};

/**
 * Gets the image URL.
 *
 * Returns the URL of the featured image or the URL of the first image in the content.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The image URL.
 */
export const getEditorDataImageUrl = state => get( state, "editorData.imageUrl", "" );

/**
 * Gets the fallback image URL.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The fallback image url.
 */
export const getEditorDataImageFallback = state => {
	const fallbacks = [
		{ featuredOrFirstImage: get( state, "editorData.imageUrl", "" ) },
		{ socialImage: get( window, "wpseoScriptData.metabox.social_image_template", "" ) },
		{ siteWideImage: get( window.wpseoScriptData, "metabox.showSocial.facebook" ) && get( state, "settings.socialPreviews.sitewideImage", "" ) },
	];

	/*
	 * This filter is also applied to the `getImageFallback` selector for the
	 * Classic and Block editors. It's then used in Yoast SEO WooCommerce, to add
	 * the first product gallery image to the fallback, before the `socialImage`
	 * or before the `siteWideImage`.
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
 * Gets the slug.
 *
 * @param {Object} state The state.
 *
 * @returns {string} The slug.
 */
export const getEditorDataSlug = state => get( state, "editorData.slug", "" );

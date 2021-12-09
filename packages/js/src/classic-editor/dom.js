import { get } from "lodash";

import { tmceId, getContentTinyMce } from "../lib/tinymce";
import { excerptFromContent } from "../helpers/replacementVariableHelpers";
import firstImageUrlInContent from "../helpers/firstImageUrlInContent";

export const DOM_IDS = {
	// WP classic editor ids
	TITLE: "title",
	CONTENT: tmceId,
	EXCERPT: "excerpt",
	PERMALINK: "sample-permalink",
	// Yoast hidden input ids
	SEO_TITLE: "yoast_wpseo_title",
	META_DESCRIPTION: "yoast_wpseo_metadesc",
	FOCUS_KEYPHRASE: "yoast_wpseo_focuskw",
	CORNERSTONE: "yoast_wpseo_is_cornerstone",
};

/**
 * The query selector for finding the featured image in the classic editor.
 *
 * @type {string}
 */
const FEATURED_IMAGE_QUERY_SELECTOR = "#set-post-thumbnail img";

export const getTitleElem = () => document.getElementById( DOM_IDS.TITLE );

/**
 * Gets the title from the document.
 *
 * @returns {string} The title or an empty string.
 */
export const getTitle = () => get( document.getElementById( DOM_IDS.TITLE ), "value", "" );

/**
 * Gets the cotnent from the document.
 *
 * @returns {string} The cotnent or an empty string.
 */
export const getContent = () => getContentTinyMce( DOM_IDS.CONTENT );

/**
 * Gets the permalink from the document.
 *
 * @returns {string} The permalink or an empty string.
 */
export const getPermalink = () => get( document.getElementById( DOM_IDS.PERMALINK ), "innerText", "" );

/**
 * Gets the date from the document.
 *
 * @returns {string} The date or an empty string.
 */
export const getDate = () => get( window, [ "wpseoScriptData", "metabox", "metaDescriptionDate" ], "" );

/**
 * Gets the meta description from the document.
 *
 * @returns {string} The meta description or an empty string.
 */
export const getMetaDescription = () => get( document.getElementById( DOM_IDS.META_DESCRIPTION ), "value", "" );

/**
 * Gets the SEO title from the document.
 *
 * @returns {string} The SEO title or an empty string.
 */
export const getSeoTitle = () => get( document.getElementById( DOM_IDS.SEO_TITLE ), "value", "" );

/**
 * Gets the focus keyphrase from the document.
 *
 * @returns {string} The focus keyphrase or an empty string.
 */
export const getFocusKeyphrase = () => get( document.getElementById( DOM_IDS.FOCUS_KEYPHRASE ), "value", "" );

/**
 * Gets the focus keyphrase from the document.
 *
 * @returns {string} The focus keyphrase or an empty string.
 */
export const isCornerstone = () => get( document.getElementById( DOM_IDS.CORNERSTONE ), "value", false );

/**
 * Gets the slug from the document.
 *
 * @returns {string} The slug or an empty string.
 */
export const getSlug = () => {
	let slug = "";

	const newPostSlug = document.getElementById( "new-post-slug" );

	if ( newPostSlug ) {
		slug = newPostSlug.value;
	} else if ( document.getElementById( "editable-post-name-full" ) !== null ) {
		slug = document.getElementById( "editable-post-name-full" ).textContent;
	}

	return slug;
};

/**
 * Gets the excerpt from the document.
 *
 * @returns {string} The excerpt or an empty string.
 */
export const getExcerpt = () => {
	const excerptElement = document.getElementById( "excerpt" );
	const excerptValue   = excerptElement && excerptElement.value || "";

	if ( excerptValue !== "" ) {
		return excerptValue;
	}

	return excerptFromContent( getContent() );
};

/**
 * Returns the featured image source if one is set.
 *
 * @returns {string} The source of the featured image.
 */
const getFeaturedImageSetInEditor = () => document.querySelector( FEATURED_IMAGE_QUERY_SELECTOR ).getAttribute( "src" ) || "";

/**
 * Gets the featured image if one is set. Falls back to the first image from the content.
 *
 * @returns {string} The featured image.
 */
export const getFeaturedImage = () => getFeaturedImageSetInEditor() || firstImageUrlInContent( getContent() ) || "";

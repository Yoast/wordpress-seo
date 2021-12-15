import { get, set, isEqual } from "lodash";

import { getContentTinyMce } from "../../lib/tinymce";
import { excerptFromContent } from "../../helpers/replacementVariableHelpers";
import firstImageUrlInContent from "../../helpers/firstImageUrlInContent";

export const DOM_IDS = {
	TITLE: "title",
	CONTENT: "content",
	CONTENT_TERM: "description",
	EXCERPT: "excerpt",
	PERMALINK: "sample-permalink",
	FEATURED_IMAGE_ID: "_thumbnail_id",
	SLUG: "slug",
	SLUG_NEW_POST: "new-post-slug",
	SLUG_EDIT_POST: "editable-post-name-full",
	DATE_MONTH: "mm",
	DATE_DAY: "jj",
	DATE_YEAR: "aa",
	DATE_HOUR: "hh",
	DATE_MINUTE: "mn",
};

export const DOM_QUERIES = {
	EDIT_SLUG_BUTTON: "#edit-slug-buttons .edit-slug",
	SAVE_SLUG_BUTTON: "#edit-slug-buttons .save",
	CANCEL_SLUG_BUTTON: "#edit-slug-buttons .cancel",
};

export const DOM_YOAST_IDS = {
	SEO_TITLE: "yoast_wpseo_title",
	META_DESCRIPTION: "yoast_wpseo_metadesc",
	FOCUS_KEYPHRASE: "yoast_wpseo_focuskw",
	IS_CORNERSTONE: "yoast_wpseo_is_cornerstone",
};

/**
 * Gets the title from the document.
 *
 * @returns {string} The 	title or an empty string.
 */
export const getTitle = () => get( document.getElementById( DOM_IDS.TITLE ), "value", "" );

/**
 * Gets the content from the document.
 *
 * @returns {string} The content or an empty string.
 */
export const getContent = () => getContentTinyMce( DOM_IDS.CONTENT ) || getContentTinyMce( DOM_IDS.CONTENT_TERM ) || "";

/**
 * Gets the date month from the document.
 *
 * @returns {string} The date month or an empty string.
 */
export const getDateMonth = () => get( document.getElementById( DOM_IDS.DATE_MONTH ), "value", "" );

/**
 * Gets the date day from the document.
 *
 * @returns {string} The date day or an empty string.
 */
export const getDateDay = () => get( document.getElementById( DOM_IDS.DATE_DAY ), "value", "" );

/**
 * Gets the date year from the document.
 *
 * @returns {string} The date year or an empty string.
 */
export const getDateYear = () => get( document.getElementById( DOM_IDS.DATE_YEAR ), "value", "" );

/**
 * Gets the date from the document.
 *
 * @returns {string} The date or an empty string.
 */
export const getDate = () => `${ getDateYear() }-${ getDateMonth() }-${ getDateDay() }`;

/**
 * Gets the meta description from the document.
 *
 * @returns {string} The meta description or an empty string.
 */
export const getMetaDescription = () => get( document.getElementById( DOM_YOAST_IDS.META_DESCRIPTION ), "value", "" );

/**
 * Gets the SEO title from the document.
 *
 * @returns {string} The SEO title or an empty string.
 */
export const getSeoTitle = () => get( document.getElementById( DOM_YOAST_IDS.SEO_TITLE ), "value", "" );


/**
 * Gets the focus keyphrase from the document.
 *
 * @returns {string} The focus keyphrase or an empty string.
 */
export const getIsCornerstone = () => isEqual( "1", get( document.getElementById( DOM_YOAST_IDS.IS_CORNERSTONE ), "value", "0" ) );

/**
 * Gets the slug from the document.
 *
 * @returns {string} The slug or an empty string.
 */
export const getSlug = () => (
	get( document.getElementById( DOM_IDS.SLUG_NEW_POST ), "value" ) ||
	get( document.getElementById( DOM_IDS.SLUG_EDIT_POST ), "textContent" ) ||
	get( document.getElementById( DOM_IDS.SLUG ), "value", "" )
);

/**
 * Gets the permalink from the document.
 *
 * @returns {string} The permalink or an empty string.
 */
export const getPermalink = () => get( window, "wpseoScriptData.metabox.base_url", "" ) + getSlug();

/**
 * Gets the excerpt from the document.
 *
 * @returns {string} The excerpt or an empty string.
 */
export const getExcerpt = () => get( document.getElementById( DOM_IDS.EXCERPT ), "value", "" ) || excerptFromContent( getContent() );

/**
 * Returns the featured image source if one is set.
 *
 * @returns {string} The source of the featured image.
 */
const getFeaturedImageSetInEditor = () => document.querySelector( DOM_QUERIES.FEATURED_IMAGE )?.getAttribute( "src" ) || "";

/**
 * Gets the featured image if one is set. Falls back to the first image from the content.
 *
 * @returns {string} The featured image URL.
 */
export const getFeaturedImageUrl = () => getFeaturedImageSetInEditor() || firstImageUrlInContent( getContent() ) || "";

/**
 * Gets the focus keyphrase from the document.
 *
 * @returns {string} The focus keyphrase or an empty string.
 */
export const getFocusKeyphrase = () => get( document.getElementById( DOM_YOAST_IDS.FOCUS_KEYPHRASE ), "value", "" );

/**
 * Set the SEO title value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setSeoTitle = ( value ) => set( document.getElementById( DOM_YOAST_IDS.SEO_TITLE ), "value", value );

/**
  * Set the meta description value prop on its DOM element.
  *
  * @param {*} value The value to set.
  * @returns {HTMLElement} The DOM element.
  */
export const setMetaDescription = ( value ) => set( document.getElementById( DOM_YOAST_IDS.META_DESCRIPTION ), "value", value );

/**
  * Set the is cornerstone value prop on its DOM element.
  *
  * @param {boolean} value The value to set.
  * @returns {HTMLElement} The DOM element.
  */
export const setIsCornerstone = ( value ) => set( document.getElementById( DOM_YOAST_IDS.IS_CORNERSTONE ), "value", value ? 1 : 0 );

/**
  * Set the focus keyphrase value prop on its DOM element.
  *
  * @param {boolean} value The value to set.
  * @returns {HTMLElement} The DOM element.
  */
export const setFocusKeyphrase = ( value ) => set( document.getElementById( DOM_YOAST_IDS.FOCUS_KEYPHRASE ), "value", value );

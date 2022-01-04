import { get, isEqual, set, flow } from "lodash";
import { excerptFromContent } from "../../helpers/replacementVariableHelpers";
import { getContentTinyMce } from "../../lib/tinymce";

export const DOM_IDS = {
	// Post editor.
	POST_TITLE: "title",
	POST_CONTENT: "content",
	POST_EXCERPT: "excerpt",
	POST_PERMALINK: "sample-permalink",
	POST_FEATURED_IMAGE_ID: "_thumbnail_id",
	POST_FEATURED_IMAGE_PARENT: "postimagediv",
	POST_FEATURED_IMAGE_REMOVE: "remove-post-thumbnail",
	POST_SLUG_NEW: "new-post-slug",
	POST_SLUG_EDIT: "editable-post-name-full",
	POST_DATE_MONTH: "mm",
	POST_DATE_DAY: "jj",
	POST_DATE_YEAR: "aa",
	POST_DATE_HOUR: "hh",
	POST_DATE_MINUTE: "mn",
	// Term editor.
	TERM_NAME: "name",
	TERM_DESCRIPTION: "description",
	TERM_SLUG: "slug",
};

export const DOM_QUERIES = {
	POST_EDIT_SLUG_BUTTON: "#edit-slug-buttons .edit-slug",
	POST_SAVE_SLUG_BUTTON: "#edit-slug-buttons .save",
	POST_CANCEL_SLUG_BUTTON: "#edit-slug-buttons .cancel",
	POST_FEATURED_IMAGE: "#set-post-thumbnail img",
	POST_SAVE_DATE_BUTTON: "#timestampdiv .save-timestamp",
};

export const DOM_YOAST_IDS = {
	// Post.
	POST_SEO_TITLE: "yoast_wpseo_title",
	POST_META_DESCRIPTION: "yoast_wpseo_metadesc",
	POST_FOCUS_KEYPHRASE: "yoast_wpseo_focuskw",
	POST_IS_CORNERSTONE: "yoast_wpseo_is_cornerstone",
	POST_SEO_SCORE: "yoast_wpseo_linkdex",
	POST_READABILITY_SCORE: "yoast_wpseo_content_score",
	// Term.
	TERM_SEO_TITLE: "hidden_wpseo_title",
	TERM_META_DESCRIPTION: "hidden_wpseo_desc",
	TERM_FOCUS_KEYPHRASE: "hidden_wpseo_focuskw",
	TERM_IS_CORNERSTONE: "hidden_wpseo_is_cornerstone",
	TERM_SEO_SCORE: "hidden_wpseo_linkdex",
	TERM_READABILITY_SCORE: "hidden_wpseo_content_score",
};

/**
 * Create a function that gets a prop from a DOM element.
 *
 * @param {string} domId Id of DOM element.
 * @param {string} [prop] Name of the prop to get. Defaults to value prop.
 * @param {*} [defaultValue] Default to return if prop is not found. Default to empty string.
 * @returns {Function} Function that gets prop from DOM element.
 */
const createGetDomElementProp = ( domId, prop = "value", defaultValue = "" ) => () => get( document.getElementById( domId ), prop, defaultValue );

/**
 * Create a function that gets a prop from a DOM element.
 *
 * @param {string} domId Id of DOM element.
 * @param {string} [prop] Name of the prop to set. Defaults to value prop.
 * @returns {Function} Function that sets value on DOM element prop.
 */
const createSetDomElementProp = ( domId, prop = "value" ) => ( value ) => set( document.getElementById( domId ), prop, value );

/**
 * Gets the post title from the document.
 *
 * @returns {string} The post title or an empty string.
 */
export const getPostTitle = createGetDomElementProp( DOM_IDS.POST_TITLE );

/**
 * Gets the term name from the document.
 *
 * @returns {string} The term name or an empty string.
 */
export const getTermName = createGetDomElementProp( DOM_IDS.TERM_NAME );

/**
 * Gets the post content from the document.
 *
 * @returns {string} The post content or an empty string.
 */
export const getPostContent = () => getContentTinyMce( DOM_IDS.POST_CONTENT ) || "";

/**
 * Gets the term description from the document.
 *
 * @returns {string} The term description or an empty string.
 */
export const getTermDescription = () => getContentTinyMce( DOM_IDS.TERM_DESCRIPTION ) || "";

/**
 * Gets the post date month from the document.
 *
 * @returns {string} The post date month or an empty string.
 */
export const getPostDateMonth = createGetDomElementProp( DOM_IDS.POST_DATE_MONTH );

/**
 * Gets the post date day from the document.
 *
 * @returns {string} The post date day or an empty string.
 */
export const getPostDateDay = createGetDomElementProp( DOM_IDS.POST_DATE_DAY );

/**
 * Gets the post date year from the document.
 *
 * @returns {string} The post date year or an empty string.
 */
export const getPostDateYear = createGetDomElementProp( DOM_IDS.POST_DATE_YEAR );

/**
 * Gets the post date from the document.
 *
 * @returns {string} The post date or an empty string.
 */
export const getPostDate = () => `${ getPostDateYear() }-${ getPostDateMonth() }-${ getPostDateDay() }`;

/**
 * Gets the post SEO title from the document.
 *
 * @returns {string} The post SEO title or an empty string.
 */
export const getPostSeoTitle = createGetDomElementProp( DOM_YOAST_IDS.POST_SEO_TITLE );

/**
 * Gets the term SEO title from the document.
 *
 * @returns {string} The term SEO title or an empty string.
 */
export const getTermSeoTitle = createGetDomElementProp( DOM_YOAST_IDS.TERM_SEO_TITLE );

/**
 * Gets the post meta description from the document.
 *
 * @returns {string} The post meta description or an empty string.
 */
export const getPostMetaDescription = createGetDomElementProp( DOM_YOAST_IDS.POST_META_DESCRIPTION );

/**
 * Gets the term meta description from the document.
 *
 * @returns {string} The term meta description or an empty string.
 */
export const getTermMetaDescription = createGetDomElementProp( DOM_YOAST_IDS.TERM_META_DESCRIPTION );

/**
 * Gets the term focus keyphrase from the document.
 *
 * @returns {string} The term focus keyphrase or an empty string.
 */
export const getPostIsCornerstone = () => isEqual( "1", get( document.getElementById( DOM_YOAST_IDS.POST_IS_CORNERSTONE ), "value", "0" ) );

/**
 * Gets the term focus keyphrase from the document.
 *
 * @returns {string} The term focus keyphrase or an empty string.
 */
export const getTermIsCornerstone = () => isEqual( "1", get( document.getElementById( DOM_YOAST_IDS.TERM_IS_CORNERSTONE ), "value", "0" ) );

/**
 * Gets the post slug from the document.
 *
 * @returns {string} The post slug or an empty string.
 */
export const getPostSlug = () => (
	get( document.getElementById( DOM_IDS.POST_SLUG_NEW ), "value" ) ||
	get( document.getElementById( DOM_IDS.POST_SLUG_EDIT ), "textContent" )
);

/**
 * Gets the term slug from the document.
 *
 * @returns {string} The term slug or an empty string.
 */
export const getTermSlug = createGetDomElementProp( DOM_IDS.TERM_SLUG );

/**
 * Gets the post permalink from the document.
 *
 * @returns {string} The post permalink or an empty string.
 */
export const getPostPermalink = () => get( window, "wpseoScriptData.metabox.base_url", "" ) + getPostSlug();

/**
 * Gets the term permalink from the document.
 *
 * @returns {string} The term permalink or an empty string.
 */
export const getTermPermalink = () => get( window, "wpseoScriptData.metabox.base_url", "" ) + getTermSlug();

/**
 * Gets the post excerpt from the document.
 *
 * @returns {string} The post excerpt or an empty string.
 */
export const getPostExcerpt = () => get( document.getElementById( DOM_IDS.POST_EXCERPT ), "value", "" ) || excerptFromContent( getPostContent() );

/**
 * Gets the post featured image source if one is set.
 *
 * @returns {string} The featured image source or an empty string.
 */
const getPostFeaturedImageUrl = () => document.querySelector( DOM_QUERIES.POST_FEATURED_IMAGE )?.getAttribute( "src" ) || "";

/**
 * Gets the post featured image ID if one is set.
 *
 * @returns {number} The featured image ID or -1, or NaN if parsing to a number went wrong.
 */
const getPostFeaturedImageId = flow( [ createGetDomElementProp( DOM_IDS.POST_FEATURED_IMAGE_ID ), parseInt ] );

/**
 * Gets the post featured image width if one is set.
 *
 * @returns {number} The featured image width or -1, or NaN if parsing to a number went wrong.
 */
const getPostFeaturedImageWidth = flow( [
	() => document.querySelector( DOM_QUERIES.POST_FEATURED_IMAGE )?.getAttribute( "width" ) || "-1",
	parseInt,
] );

/**
 * Gets the post featured image height if one is set.
 *
 * @returns {number} The featured image height or -1, or NaN if parsing to a number went wrong.
 */
const getPostFeaturedImageHeight = flow( [
	() => document.querySelector( DOM_QUERIES.POST_FEATURED_IMAGE )?.getAttribute( "height" ) || "-1",
	parseInt,
] );

/**
 * Gets the post featured image alt if one is set.
 *
 * @returns {string} The featured image alt or an empty string.
 */
const getPostFeaturedImageAlt = () => document.querySelector( DOM_QUERIES.POST_FEATURED_IMAGE )?.getAttribute( "alt" ) || "";

/**
 * Gets the featured image from the document.
 *
 * @returns {{ id: number, url: string, width: number, height: number, alt: string }} The featured image.
 */
export const getPostFeaturedImage = () => ( {
	id: getPostFeaturedImageId(),
	url: getPostFeaturedImageUrl(),
	width: getPostFeaturedImageWidth(),
	height: getPostFeaturedImageHeight(),
	alt: getPostFeaturedImageAlt(),
} );

/**
 * Gets the post focus keyphrase from the document.
 *
 * @returns {string} The post focus keyphrase or an empty string.
 */
export const getPostFocusKeyphrase = createGetDomElementProp( DOM_YOAST_IDS.POST_FOCUS_KEYPHRASE );

/**
 * Gets the term focus keyphrase from the document.
 *
 * @returns {string} The term focus keyphrase or an empty string.
 */
export const getTermFocusKeyphrase = createGetDomElementProp( DOM_YOAST_IDS.TERM_FOCUS_KEYPHRASE );

/**
 * Gets the post SEO score from the document.
 *
 * @returns {string} The post SEO score or an empty string.
 */
export const getPostSeoScore = createGetDomElementProp( DOM_YOAST_IDS.POST_SEO_SCORE );

/**
 * Gets the term SEO score from the document.
 *
 * @returns {string} The term SEO score or an empty string.
 */
export const getTermSeoScore = createGetDomElementProp( DOM_YOAST_IDS.TERM_SEO_SCORE );

/**
 * Gets the post readability score from the document.
 *
 * @returns {string} The post readability score or an empty string.
 */
export const getPostReadabilityScore = createGetDomElementProp( DOM_YOAST_IDS.POST_READABILITY_SCORE );

/**
 * Gets the term readability score from the document.
 *
 * @returns {string} The term readability score or an empty string.
 */
export const getTermReadabilityScore = createGetDomElementProp( DOM_YOAST_IDS.TERM_READABILITY_SCORE );

/**
 * Sets the post SEO title value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostSeoTitle = createSetDomElementProp( DOM_YOAST_IDS.POST_SEO_TITLE );

/**
 * Sets the term SEO title value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermSeoTitle = createSetDomElementProp( DOM_YOAST_IDS.TERM_SEO_TITLE );

/**
 * Sets the post meta description value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostMetaDescription = createSetDomElementProp( DOM_YOAST_IDS.POST_META_DESCRIPTION );

/**
 * Sets the term meta description value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermMetaDescription = createSetDomElementProp( DOM_YOAST_IDS.TERM_META_DESCRIPTION );

/**
 * Sets the post is cornerstone value prop on its DOM element.
 *
 * @param {boolean} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostIsCornerstone = ( value ) => set( document.getElementById( DOM_YOAST_IDS.POST_IS_CORNERSTONE ), "value", value ? 1 : 0 );

/**
 * Sets the term is cornerstone value prop on its DOM element.
 *
 * @param {boolean} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermIsCornerstone = ( value ) => set( document.getElementById( DOM_YOAST_IDS.TERM_IS_CORNERSTONE ), "value", value ? 1 : 0 );

/**
 * Sets the post focus keyphrase value prop on its DOM element.
 *
 * @param {boolean} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostFocusKeyphrase = createSetDomElementProp( DOM_YOAST_IDS.POST_FOCUS_KEYPHRASE );

/**
 * Sets the term focus keyphrase value prop on its DOM element.
 *
 * @param {boolean} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermFocusKeyphrase = createSetDomElementProp( DOM_YOAST_IDS.TERM_FOCUS_KEYPHRASE );

/**
 * Sets the post SEO score value prop on its DOM element.
 *
 * @param {boolean} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostSeoScore = createSetDomElementProp( DOM_YOAST_IDS.POST_SEO_SCORE );

/**
 * Sets the term SEO score value prop on its DOM element.
 *
 * @param {boolean} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermSeoScore = createSetDomElementProp( DOM_YOAST_IDS.TERM_SEO_SCORE );

/**
 * Sets the post readability score value prop on its DOM element.
 *
 * @param {boolean} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostReadabilityScore = createSetDomElementProp( DOM_YOAST_IDS.POST_READABILITY_SCORE );

/**
 * Sets the term readability score value prop on its DOM element.
 *
 * @param {boolean} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermReadabilityScore = createSetDomElementProp( DOM_YOAST_IDS.TERM_READABILITY_SCORE );

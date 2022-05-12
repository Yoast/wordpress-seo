/* global moment */
import { flow, get, isEqual, set, map, sortBy } from "lodash";
import { getContentTinyMce } from "../../lib/tinymce";
import getContentLocale from "../../analysis/getContentLocale";
import { getValuesFromCheckboxes } from "../../helpers/getValuesFromCheckboxes";

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
	POST_SLUG: "editable-post-name",
	POST_NAME: "post_name",
	POST_SLUG_EDIT_PARENT: "edit-slug-box",
	POST_DATE_MONTH: "mm",
	POST_DATE_DAY: "jj",
	POST_DATE_YEAR: "aa",
	POST_DATE_HOURS: "hh",
	POST_DATE_MINUTES: "mn",
	POST_DATE_SECONDS: "ss",
	// Term editor.
	TERM_NAME: "name",
	TERM_DESCRIPTION: "description",
	TERM_SLUG: "slug",
};

export const DOM_CLASSES = {
	POST_SLUG_SAVE_BUTTON: "save",
};

export const DOM_QUERIES = {
	POST_FEATURED_IMAGE: "#set-post-thumbnail img",
	POST_DATE_SAVE_BUTTON: "#timestampdiv .save-timestamp",
};

export const DOM_YOAST_IDS = {
	// Post.
	POST_SEO_TITLE: "yoast_wpseo_title",
	POST_META_DESCRIPTION: "yoast_wpseo_metadesc",
	POST_FOCUS_KEYPHRASE: "yoast_wpseo_focuskw",
	POST_IS_CORNERSTONE: "yoast_wpseo_is_cornerstone",
	POST_SEO_SCORE: "yoast_wpseo_linkdex",
	POST_READABILITY_SCORE: "yoast_wpseo_content_score",
	POST_TWITTER_IMAGE_ID: "yoast_wpseo_twitter-image-id",
	POST_TWITTER_IMAGE_URL: "yoast_wpseo_twitter-image",
	POST_TWITTER_TITLE: "yoast_wpseo_twitter-title",
	POST_TWITTER_DESCRIPTION: "yoast_wpseo_twitter-description",
	POST_FACEBOOK_IMAGE_ID: "yoast_wpseo_opengraph-image-id",
	POST_FACEBOOK_IMAGE_URL: "yoast_wpseo_opengraph-image",
	POST_FACEBOOK_TITLE: "yoast_wpseo_opengraph-title",
	POST_FACEBOOK_DESCRIPTION: "yoast_wpseo_opengraph-description",
	// Term.
	TERM_SEO_TITLE: "hidden_wpseo_title",
	TERM_META_DESCRIPTION: "hidden_wpseo_desc",
	TERM_FOCUS_KEYPHRASE: "hidden_wpseo_focuskw",
	TERM_IS_CORNERSTONE: "hidden_wpseo_is_cornerstone",
	TERM_SEO_SCORE: "hidden_wpseo_linkdex",
	TERM_READABILITY_SCORE: "hidden_wpseo_content_score",
	TERM_TWITTER_IMAGE_ID: "hidden_wpseo_twitter-image-id",
	TERM_TWITTER_IMAGE_URL: "hidden_wpseo_twitter-image",
	TERM_TWITTER_TITLE: "hidden_wpseo_twitter-title",
	TERM_TWITTER_DESCRIPTION: "hidden_wpseo_twitter-description",
	TERM_FACEBOOK_IMAGE_ID: "hidden_wpseo_opengraph-image-id",
	TERM_FACEBOOK_IMAGE_URL: "hidden_wpseo_opengraph-image",
	TERM_FACEBOOK_TITLE: "hidden_wpseo_opengraph-title",
	TERM_FACEBOOK_DESCRIPTION: "hidden_wpseo_opengraph-description",
};

/**
 * Create a function that gets a prop from a DOM element.
 *
 * @param {string} domId Id of DOM element.
 * @param {string} [prop] Name of the prop to get. Defaults to value prop.
 * @param {*} [defaultValue] Default to return if prop is not found. Defaults to empty string.
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
 * Create a function that parses the return value of function to an integer.
 *
 * @param {Function} fn The function that should return a value.
 * @returns {Function} Function that wraps the fn and parses the return value to an integer.
 */
const createAsInteger = ( fn ) => flow( [ fn, parseInt ] );

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
 * @returns {number} The post date month or 1.
 */
const getPostDateMonth = createAsInteger( createGetDomElementProp( DOM_IDS.POST_DATE_MONTH, "value", 1 ) );

/**
 * Gets the post date day from the document.
 *
 * @returns {number} The post date day or 1.
 */
const getPostDateDay = createAsInteger( createGetDomElementProp( DOM_IDS.POST_DATE_DAY, "value", 1 ) );

/**
 * Gets the post date year from the document.
 *
 * @returns {number} The post date year or 1970.
 */
const getPostDateYear = createAsInteger( createGetDomElementProp( DOM_IDS.POST_DATE_YEAR, "value", 1970 ) );

/**
 * Gets the post date hour from the document.
 *
 * @returns {number} The post date hour or 0.
 */
const getPostDateHours = createAsInteger( createGetDomElementProp( DOM_IDS.POST_DATE_HOURS, "value", 0 ) );

/**
 * Gets the post date minute from the document.
 *
 * @returns {number} The post date minute or 0.
 */
const getPostDateMinutes = createAsInteger( createGetDomElementProp( DOM_IDS.POST_DATE_MINUTES, "value", 0 ) );

/**
 * Gets the post date second from the document.
 *
 * @returns {number} The post date second or 0.
 */
const getPostDateSeconds = createAsInteger( createGetDomElementProp( DOM_IDS.POST_DATE_SECONDS, "value", 0 ) );

/**
 * Gets the post date from the document.
 *
 * Note: the inputs are not UTC, but rather the site's timezone.
 * Therefor, the site's timezone is needed to transform to UTC properly.
 *
 * @returns {string} The post date ISO string.
 */
export const getPostDate = () => {
	// Try to get the site's timezone from the window.
	const timezone = get( window, "wpseoScriptData.siteTimezone", "+00:00" );

	/*
	 * Check if the timezone is a custom UTC offset instead of a named one.
	 * WordPress supports setting a custom offset, e.g. +08:45.
	 */
	if ( timezone.startsWith( "-" ) || timezone.startsWith( "+" ) ) {
		// Input the date as a string, since this is the only way to input with timezone other than the browser timezone.
		const date = new Date(
			`${ getPostDateYear() }-${ getPostDateMonth() }-${ getPostDateDay() } ` +
			`${ getPostDateHours() }:${ getPostDateMinutes() }:${ getPostDateSeconds() } ${ timezone }`
		);

		return new Date( date ).toISOString();
	}

	// Use moment if the timezone is a named, e.g. Europe/Amsterdam.
	return moment.tz( [
		getPostDateYear(),
		// The month in the input goes from 1 to 12, we need 0 - 11.
		getPostDateMonth() - 1,
		getPostDateDay(),
		getPostDateHours(),
		getPostDateMinutes(),
		getPostDateSeconds(),
	], timezone ).toISOString();
};

/**
 * Gets the category checkboxes elements from the document, from the "All Categories" section.
 *
 * @returns {HTMLInputElement[]} The category checkboxes from the "All Categories" section.
 */
export const getPostCategoryCheckboxes = () => {
	return [ ...document.querySelectorAll( "#categorychecklist input[type=checkbox]" ) ];
};

/**
 * Gets the category checkboxes elements from the document, from the "Most Used" section.
 *
 * @returns {HTMLInputElement[]} The category checkboxes from the "Most Used" section.
 */
export const getPostMostUsedCategoryCheckboxes = () => {
	return [ ...document.querySelectorAll( "#categorychecklist-pop input[type=checkbox]" ) ];
};

/**
 * Gets the current post's categories from the document.
 *
 * @returns {{name: string, id: string}[]} The post's categories.
 */
export const getPostCategories = () => {
	// Only consider the "All Categories" section here, as including the "Most Used" section would yield duplicates.
	const checkboxes = getPostCategoryCheckboxes();

	if ( checkboxes ) {
		const checkedCheckboxes = checkboxes.filter( checkbox => checkbox.checked );
		return getValuesFromCheckboxes( checkedCheckboxes );
	}
	return [];
};

/**
 * Gets the current post's tags or custom tags from the document using the ID of the parent element.
 *
 * @param {String} termID The parent element id of the tags or custom tags.
 *
 * @returns {String[]} The post's tags
 */
export const getPostTags = ( termID = "post_tag" ) => {
	const tagChecklistElement = document.querySelectorAll( `#${ termID } .tagchecklist` );

	if ( tagChecklistElement.length > 0 ) {
		// Each tag is a <li> element containing a button and two text elements. The second text element contains the name of the tag.
		const tagsList = [ ...tagChecklistElement[ 0 ].childNodes ];
		// Get the names of the tags.
		const tagsNames = tagsList.map( tag => [ ...tag.childNodes ][ 2 ].textContent );
		// Returns the array sorted alphabetically.
		return sortBy( tagsNames, name => name.toLowerCase() );
	}

	return [];
};

/**
 * Gets the hierarchical custom taxonomy checkboxes elements from the document, from the "All (Custom taxonomy name)" section.
 *
 * @param {String} name The custom taxonomy name for retrieving the element from the document.
 *
 * @returns {HTMLInputElement[]} The category checkboxes from the "All (Custom taxonomy name)" section.
 */
export const getCTCheckboxes = ( name ) => {
	return [ ...document.querySelectorAll( `#${ name }checklist input[type=checkbox]` ) ];
};

/**
 * Gets the hierarchical custom taxonomy checkboxes elements from the document, from the "Most Used" section.
 *
 * @param {String} name The custom taxonomy name for retrieving the element from the document.
 *
 * @returns {HTMLInputElement[]} The category checkboxes from the "Most Used" section.
 */
export const getMostUsedCTCheckboxes = ( name ) => {
	return [ ...document.querySelectorAll( `#${ name }checklist-pop input[type=checkbox]` ) ];
};

/**
 * Gets the array of names of custom taxonomies from `wpseoScriptData`.
 *
 * @returns {String[]} An array of the names of custom taxonomies.
 */
export const getCTNames = () => {
	return map( get( window, "wpseoScriptData.analysis.plugins.replaceVars.replace_vars.custom_taxonomies" ), ( { name } ) => name );
};

/**
 * Gets the custom taxonomies, both hierarchical and non-hierarchical from the document.
 *
 * @returns {Object} An object which contains the custom taxonomy data, the output structure: { name1: [ {id: "", value: ""} ], name2 [ "", "" ] }.
 * `name1` refers to the structure of a hierarchical custom taxonomy, `name2` refers to the structure of a non-hierarchical custom taxonomy.
 */
export const getCustomTaxonomies = () => {
	const names = getCTNames();
	const customTaxonomies = {};

	/*
	 * For every custom taxonomy name retrieved from `wpseoScriptData`, we retrieve the custom element checkboxes if it's present in DOM,
	 * save the value in the `customTaxonomies` object with the name as the key.
	 * If the element with the name is not present in DOM, we check if there is non-hierarchical custom taxonomy,
	 * and assign the result to the `customTaxonomies` object with the name as the key.
	 */
	names.forEach( name => {
		const checkboxesElement = getCTCheckboxes( name );
		const customTags = getPostTags( name );
		if ( checkboxesElement.length === 0 ) {
			customTaxonomies[ name ] = customTags;
		} else {
			const checkedCheckboxes = checkboxesElement.filter( checkbox => checkbox.checked );
			customTaxonomies[ name ] = getValuesFromCheckboxes( checkedCheckboxes );
		}
	} );

	return customTaxonomies;
};

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
 * Gets whether the post is cornerstone content from the document.
 *
 * @returns {boolean} Whether the post is cornerstone content.
 */
export const getPostIsCornerstone = () => isEqual( get( document.getElementById( DOM_YOAST_IDS.POST_IS_CORNERSTONE ), "value", "0" ), "1" );

/**
 * Gets whether the term is cornerstone content from the document.
 *
 * @returns {boolean} Whether the term is cornerstone content.
 */
export const getTermIsCornerstone = () => isEqual( get( document.getElementById( DOM_YOAST_IDS.TERM_IS_CORNERSTONE ), "value", "0" ), "1" );

/**
 * Gets the post edit slug from the document.
 *
 * @returns {string} The post edit slug or an empty string.
 */
export const getPostNewSlug = () => get( document.getElementById( DOM_IDS.POST_SLUG_NEW ), "value" );

/**
 * Gets the post edit full length slug from the document.
 *
 * @returns {string} The post edit full length slug or an empty string.
 */
export const getPostEditSlugFull = () => get( document.getElementById( DOM_IDS.POST_SLUG_EDIT ), "textContent" );

/**
 * Sets the post edit full length slug value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostSlugFull = createSetDomElementProp( DOM_IDS.POST_SLUG_EDIT, "textContent" );

/**
 * Gets the post edit shortened slug from the document.
 * When the slug is too long, WordPress shortens it for the preview purpose.
 *
 * @returns {string} The post edit shortened slug or an empty string.
 */
export const getPostEditSlug = () => get( document.getElementById( DOM_IDS.POST_SLUG ), "textContent" );

/**
 * Sets the post edit shortened slug value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostSlug = createSetDomElementProp( DOM_IDS.POST_SLUG, "textContent" );

/**
 * Gets the post name from the document.
 *
 * @returns {string} The post name or an empty string.
 */
export const getPostName = () => get( document.getElementById( DOM_IDS.POST_NAME ), "value" );

/**
 * Sets the post name value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostName = createSetDomElementProp( DOM_IDS.POST_NAME );

/**
 * Gets the post slug from the document.
 *
 * @returns {string} The post slug or an empty string.
 */
export const getPostSlug = () => {
	return getPostNewSlug() || getPostEditSlugFull() || "";
};

/**
 * Gets the term slug from the document.
 *
 * @returns {string} The term slug or an empty string.
 */
export const getTermSlug = createGetDomElementProp( DOM_IDS.TERM_SLUG );

/**
 * Sets the term slug value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermSlug = createSetDomElementProp( DOM_IDS.TERM_SLUG );

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
 * Gets the limit for the meta description based on the locale.
 *
 * @returns {number} 80 for texts in Japanese, 156 for other languages.
 */
export const getMetaDescriptionLimit = () => getContentLocale() === "ja" ? 80 : 156;

/**
 * Gets the post excerpt from the document.
 *
 * @returns {string} The post excerpt or an empty string.
 */
export const getPostExcerpt = () => get( document.getElementById( DOM_IDS.POST_EXCERPT ), "value", "" );

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
const getPostFeaturedImageId = createAsInteger( createGetDomElementProp( DOM_IDS.POST_FEATURED_IMAGE_ID ) );

/**
 * Gets the post featured image width if one is set.
 *
 * @returns {number} The featured image width or -1, or NaN if parsing to a number went wrong.
 */
const getPostFeaturedImageWidth = createAsInteger(
	() => document.querySelector( DOM_QUERIES.POST_FEATURED_IMAGE )?.getAttribute( "width" ) || "-1"
);

/**
 * Gets the post featured image height if one is set.
 *
 * @returns {number} The featured image height or -1, or NaN if parsing to a number went wrong.
 */
const getPostFeaturedImageHeight = createAsInteger(
	() => document.querySelector( DOM_QUERIES.POST_FEATURED_IMAGE )?.getAttribute( "height" ) || "-1"
);

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
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostFocusKeyphrase = createSetDomElementProp( DOM_YOAST_IDS.POST_FOCUS_KEYPHRASE );

/**
 * Sets the term focus keyphrase value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermFocusKeyphrase = createSetDomElementProp( DOM_YOAST_IDS.TERM_FOCUS_KEYPHRASE );

/**
 * Sets the post SEO score value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostSeoScore = createSetDomElementProp( DOM_YOAST_IDS.POST_SEO_SCORE );

/**
 * Sets the term SEO score value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermSeoScore = createSetDomElementProp( DOM_YOAST_IDS.TERM_SEO_SCORE );

/**
 * Sets the post readability score value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostReadabilityScore = createSetDomElementProp( DOM_YOAST_IDS.POST_READABILITY_SCORE );

/**
 * Sets the term readability score value prop on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermReadabilityScore = createSetDomElementProp( DOM_YOAST_IDS.TERM_READABILITY_SCORE );

/**
 * Sets the post Twitter image id on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostTwitterImageID = createSetDomElementProp( DOM_YOAST_IDS.POST_TWITTER_IMAGE_ID );

/**
 * Gets the post Twitter image id from the document.
 *
 * @returns {string} The post Twitter image id or an empty string.
 */
export const getPostTwitterImageID = () => get( document.getElementById( DOM_YOAST_IDS.POST_TWITTER_IMAGE_ID ), "value", "" );

/**
 * Sets the post Twitter image URL on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostTwitterImageUrl = createSetDomElementProp( DOM_YOAST_IDS.POST_TWITTER_IMAGE_URL );

/**
 * Gets the post Twitter image URL from the document.
 *
 * @returns {string} The post Twitter image URL or an empty string.
 */
export const getPostTwitterImageUrl = () => get( document.getElementById( DOM_YOAST_IDS.POST_TWITTER_IMAGE_URL ), "value", "" );

/**
 * Sets the post Twitter description on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostTwitterDescription = createSetDomElementProp( DOM_YOAST_IDS.POST_TWITTER_DESCRIPTION );

/**
 * Gets the post Twitter description from the document.
 *
 * @returns {string} The post Twitter description or an empty string.
 */
export const getPostTwitterDescription = () => get( document.getElementById( DOM_YOAST_IDS.POST_TWITTER_DESCRIPTION ), "value", "" );

/**
 * Sets the post Twitter title on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostTwitterTitle = createSetDomElementProp( DOM_YOAST_IDS.POST_TWITTER_TITLE );

/**
 * Gets the post Twitter title from the document.
 *
 * @returns {string} The post Twitter title or an empty string.
 */
export const getPostTwitterTitle = () => get( document.getElementById( DOM_YOAST_IDS.POST_TWITTER_TITLE ), "value", "" );

/**
 * Sets the term Twitter image id on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermTwitterImageID = createSetDomElementProp( DOM_YOAST_IDS.TERM_TWITTER_IMAGE_ID );

/**
 * Gets the term Twitter image id from the document.
 *
 * @returns {string} The term Twitter image id or an empty string.
 */
export const getTermTwitterImageID = () => get( document.getElementById( DOM_YOAST_IDS.TERM_TWITTER_IMAGE_ID ), "value", "" );

/**
 * Sets the term Twitter image URL on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermTwitterImageUrl = createSetDomElementProp( DOM_YOAST_IDS.TERM_TWITTER_IMAGE_URL );

/**
 * Gets the term Twitter image URL from the document.
 *
 * @returns {string} The term Twitter image URL or an empty string.
 */
export const getTermTwitterImageUrl = () => get( document.getElementById( DOM_YOAST_IDS.TERM_TWITTER_IMAGE_URL ), "value", "" );

/**
 * Sets the term Twitter description on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermTwitterDescription = createSetDomElementProp( DOM_YOAST_IDS.TERM_TWITTER_DESCRIPTION );

/**
 * Gets the term Twitter description from the document.
 *
 * @returns {string} The term Twitter description or an empty string.
 */
export const getTermTwitterDescription = () => get( document.getElementById( DOM_YOAST_IDS.TERM_TWITTER_DESCRIPTION ), "value", "" );

/**
 * Sets the term Twitter title on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermTwitterTitle = createSetDomElementProp( DOM_YOAST_IDS.TERM_TWITTER_TITLE );

/**
 * Gets the term Twitter title from the document.
 *
 * @returns {string} The term Twitter title or an empty string.
 */
export const getTermTwitterTitle = () => get( document.getElementById( DOM_YOAST_IDS.TERM_TWITTER_TITLE ), "value", "" );

/**
 * Sets the post Facebook image id on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostFacebookImageID = createSetDomElementProp( DOM_YOAST_IDS.POST_FACEBOOK_IMAGE_ID );

/**
 * Gets the post Facebook image id from the document.
 *
 * @returns {string} The post Facebook image id or an empty string.
 */
export const getPostFacebookImageID = () => get( document.getElementById( DOM_YOAST_IDS.POST_FACEBOOK_IMAGE_ID ), "value", "" );

/**
 * Sets the post Facebook image URL on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostFacebookImageUrl = createSetDomElementProp( DOM_YOAST_IDS.POST_FACEBOOK_IMAGE_URL );

/**
 * Gets the post Facebook image URL from the document.
 *
 * @returns {string} The post Facebook image URL or an empty string.
 */
export const getPostFacebookImageUrl = () => get( document.getElementById( DOM_YOAST_IDS.POST_FACEBOOK_IMAGE_URL ), "value", "" );

/**
 * Sets the post Facebook description on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostFacebookDescription = createSetDomElementProp( DOM_YOAST_IDS.POST_FACEBOOK_DESCRIPTION );

/**
 * Gets the post Facebook description from the document.
 *
 * @returns {string} The post Facebook description or an empty string.
 */
export const getPostFacebookDescription = () => get( document.getElementById( DOM_YOAST_IDS.POST_FACEBOOK_DESCRIPTION ), "value", "" );

/**
 * Sets the post Facebook title on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setPostFacebookTitle = createSetDomElementProp( DOM_YOAST_IDS.POST_FACEBOOK_TITLE );

/**
 * Gets the post Facebook title from the document.
 *
 * @returns {string} The post Facebook title or an empty string.
 */
export const getPostFacebookTitle = () => get( document.getElementById( DOM_YOAST_IDS.POST_FACEBOOK_TITLE ), "value", "" );

/**
 * Sets the term Facebook image id on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermFacebookImageID = createSetDomElementProp( DOM_YOAST_IDS.TERM_FACEBOOK_IMAGE_ID );

/**
 * Gets the term Facebook image id from the document.
 *
 * @returns {string} The term Facebook image id or an empty string.
 */
export const getTermFacebookImageID = () => get( document.getElementById( DOM_YOAST_IDS.TERM_FACEBOOK_IMAGE_ID ), "value", "" );

/**
 * Sets the term Facebook image URL on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermFacebookImageUrl = createSetDomElementProp( DOM_YOAST_IDS.TERM_FACEBOOK_IMAGE_URL );

/**
 * Gets the term Facebook image URL from the document.
 *
 * @returns {string} The term Facebook image URL or an empty string.
 */
export const getTermFacebookImageUrl = () => get( document.getElementById( DOM_YOAST_IDS.TERM_FACEBOOK_IMAGE_URL ), "value", "" );

/**
 * Sets the term Facebook description on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermFacebookDescription = createSetDomElementProp( DOM_YOAST_IDS.TERM_FACEBOOK_DESCRIPTION );

/**
 * Gets the term Facebook description from the document.
 *
 * @returns {string} The term Facebook description or an empty string.
 */
export const getTermFacebookDescription = () => get( document.getElementById( DOM_YOAST_IDS.TERM_FACEBOOK_DESCRIPTION ), "value", "" );

/**
 * Sets the term Facebook title on its DOM element.
 *
 * @param {*} value The value to set.
 * @returns {HTMLElement} The DOM element.
 */
export const setTermFacebookTitle = createSetDomElementProp( DOM_YOAST_IDS.TERM_FACEBOOK_TITLE );

/**
 * Gets the term Facebook title from the document.
 *
 * @returns {string} The term Facebook description or an empty string.
 */
export const getTermFacebookTitle = () => get( document.getElementById( DOM_YOAST_IDS.TERM_FACEBOOK_TITLE ), "value", "" );

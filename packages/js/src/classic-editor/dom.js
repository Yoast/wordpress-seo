import { get, set } from "lodash";

import { tmceId, getContentTinyMce } from "../lib/tinymce";

export const DOM_IDS = {
	// WP classic editor ids
	TITLE: "title",
	CONTENT: tmceId,
	EXCERPT: "excerpt",
	PERMALINK: "permalink",
	DATE: "date",
	// Yoast hidden input ids
	SEO_TITLE: "yoast_wpseo_title",
	META_DESCRIPTION: "yoast_wpseo_metadesc",
};

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
 * Gets the excerpt from the document.
 *
 * @returns {string} The excerpt or an empty string.
 */
export const getExcerpt = () => get( document.getElementById( DOM_IDS.EXCERPT ), "value", "" );

/**
 * Gets the permalink from the document.
 *
 * @returns {string} The permalink or an empty string.
 */
export const getPermalink = () => get( document.getElementById( DOM_IDS.PERMALINK ), "value", "" );

/**
 * Gets the date from the document.
 *
 * @returns {string} The date or an empty string.
 */
export const getDate = () => get( document.getElementById( DOM_IDS.DATE ), "value", "" );

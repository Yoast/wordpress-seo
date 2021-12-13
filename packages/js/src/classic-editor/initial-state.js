import {
	getContent,
	getDate,
	getExcerpt,
	getFeaturedImageUrl,
	getFocusKeyphrase,
	getMetaDescription,
	getPermalink,
	getSeoTitle,
	getSlug,
	getTitle,
	getIsCornerstone,
} from "./helpers/dom";
import { FOCUS_KEYPHRASE_ID } from "@yoast/seo-integration";

/**
 * Gather the initial state of the classic editor.
 *
 * @returns {Object} The initial state of the classic editor.
 */
const getEditorInitialState = () => ( {
	title: getTitle(),
	date: getDate(),
	permalink: getPermalink(),
	excerpt: getExcerpt(),
	content: getContent(),
	featuredImage: {
		url: getFeaturedImageUrl(),
	},
} );

/**
 * Gathers the initial state of the metabox of the classic editor.
 *
 * @returns {Object} The initial state of the metabox of the classic editor.
 */
const getFormInitialState = () => ( {
	seo: {
		title: getSeoTitle(),
		description: getMetaDescription(),
		slug: getSlug(),
		isCornerstone: getIsCornerstone(),
	},
	keyphrases: {
		[ FOCUS_KEYPHRASE_ID ]: {
			id: FOCUS_KEYPHRASE_ID,
			keyphrase: getFocusKeyphrase(),
		},
	},
} );

/**
 * Gathers the initial state of the SEO store.
 *
 * @returns {Object} The initial state.
 */
export const getInitialState = () => ( {
	editor: getEditorInitialState(),
	form: getFormInitialState(),
} );

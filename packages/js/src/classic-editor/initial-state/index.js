import { getContent, getDate, getExcerpt, getPermalink, getTitle } from "../dom";

/**
 * Gather the initial state of the classic editor.
 *
 * @returns {Object} The initial state of the classic editor.
 */
export const getEditorInitialState = () => ( {
	title: getTitle(),
	date: getDate(),
	permalink: getPermalink(),
	excerpt: getExcerpt(),
	content: getContent(),
	featuredImage: {},
} );

import { dispatch } from "@wordpress/data";

/**
 * Applies the Yoast SEO metadata from a content outline to the Yoast SEO store.
 *
 * Sets the snippet preview data (title, description) and the focus keyphrase. These
 * fields live outside Gutenberg's undo manager, so they are applied alongside — but
 * independently of — the post title / blocks / category edit that the caller writes
 * via `editPost`. Keeping the post-level edits in a single `editPost` call ensures
 * one Gutenberg undo entry reverts blocks, title, and category together.
 *
 * @param {object} outline The content outline from the store.
 * @param {string} outline.title The title of the post (used for the snippet preview).
 * @param {string} outline.metaDescription The meta description for the snippet preview.
 * @param {string} outline.focusKeyphrase The focus keyphrase.
 * @returns {void}
 */
export const applyYoastMetaFromOutline = ( { title, metaDescription, focusKeyphrase } ) => {
	const yoastEditor = dispatch( "yoast-seo/editor" );
	yoastEditor?.updateData?.( { title, description: metaDescription } );
	yoastEditor?.setFocusKeyword?.( focusKeyphrase );
};

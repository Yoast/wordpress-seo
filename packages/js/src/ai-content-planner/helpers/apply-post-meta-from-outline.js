import { dispatch } from "@wordpress/data";

const applyYoastMetaFromOutline = ( { title, metaDescription, focusKeyphrase } ) => {
	const yoastEditor = dispatch( "yoast-seo/editor" );
	yoastEditor?.updateData?.( { title, description: metaDescription } );
	yoastEditor?.setFocusKeyword?.( focusKeyphrase );
};

const applyCategoryFromOutline = ( category ) => {
	if ( category?.id && category.id !== -1 ) {
		dispatch( "core/editor" ).editPost( { categories: [ category.id ] } );
	}
};


/**
 * Applies the SEO metadata from a content outline to the post and Yoast SEO stores.
 *
 * Sets the post title, SEO title, meta description, focus keyphrase, and category.
 *
 * Note: each dispatch creates a separate undo entry in the Gutenberg editor.
 * WordPress does not expose a public API to group multiple edits into a single
 * undo step. This is tracked as a known limitation.
 *
 * @param {object} outline The content outline from the store.
 * @param {string} outline.title The title of the post.
 * @param {string} outline.metaDescription The meta description for the post.
 * @param {string} outline.focusKeyphrase The focus keyphrase for the post.
 * @param {object} outline.category The category for the post.
 * @param {number} outline.category.id The ID of the category to set for the post.
 * @returns {void}
 */
export const applyPostMetaFromOutline = ( { title, metaDescription, focusKeyphrase, category } ) => {
	dispatch( "core/editor" ).editPost( { title } );
	applyYoastMetaFromOutline( { title, metaDescription, focusKeyphrase } );
	applyCategoryFromOutline( category );
};

import { dispatch } from "@wordpress/data";

/**
 * Applies the SEO metadata from a content outline to the post and Yoast SEO stores.
 *
 * Sets the post title, SEO title, meta description, and focus keyphrase.
 *
 * @param {Object} outline The content outline from the store.
 * @returns {void}
 */
export const applyPostMetaFromOutline = ( outline ) => {
	dispatch( "core/editor" ).editPost( { title: outline.title } );
	dispatch( "yoast-seo/editor" ).updateData( { title: outline.title, description: outline.metaDescription } );
	dispatch( "yoast-seo/editor" ).setFocusKeyword( outline.focusKeyphrase );
};

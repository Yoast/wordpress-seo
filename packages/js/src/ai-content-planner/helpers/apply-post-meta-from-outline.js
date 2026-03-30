import { dispatch, resolveSelect } from "@wordpress/data";

/**
 * Applies the SEO metadata from a content outline to the post and Yoast SEO stores.
 *
 * Sets the post title, SEO title, meta description, focus keyphrase, and category.
 *
 * @param {Object} outline The content outline from the store.
 * @returns {Promise<void>}
 */
export const applyPostMetaFromOutline = async( outline ) => {
	dispatch( "core/editor" ).editPost( { title: outline.title } );
	dispatch( "yoast-seo/editor" ).updateData( { title: outline.title, description: outline.metaDescription } );
	dispatch( "yoast-seo/editor" ).setFocusKeyword( outline.focusKeyphrase );

	if ( outline.category ) {
		// eslint-disable-next-line camelcase
		const categories = await resolveSelect( "core" ).getEntityRecords( "taxonomy", "category", { search: outline.category, per_page: 1 } );
		if ( categories?.length > 0 ) {
			dispatch( "core/editor" ).editPost( { categories: [ categories[ 0 ].id ] } );
		}
	}
};

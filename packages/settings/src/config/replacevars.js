import { __ } from "@wordpress/i18n";
import {
	createBlogTitleReplacevar,
	createCollectionTitleReplacevar,
	createFocusKeyphraseReplacevar,
	createPageNumberReplacevar,
	createPostTagsReplacevar,
	createProductTagsReplacevar,
	createSearchPhraseReplacevar,
	createSearchResultsCountReplacevar,
	createSeparatorReplacevar,
	createSitenameReplacevar,
	createTitleReplacevar,
} from "@yoast/admin-ui-toolkit/helpers";

/**
 * Represents the focus keyword replacement variable.
 *
 * @returns {Object} The focus keyword replacement variable.
 */
export const focusKeyphrase = createFocusKeyphraseReplacevar( {
	getLabel: () => __( "Focus keyphrase", "admin-ui" ),
} );

/**
 * Represents the site name replacement variable.
 *
 * @returns {Object} The site name replacement variable.
 */
export const siteName = createSitenameReplacevar( {
	getLabel: () => __( "Site title", "admin-ui" ),
} );

export const titles = {
	/**
	 * Represents the title replacement variable.
	 *
	 * @returns {Object} The title replacement variable.
	 */
	title: createTitleReplacevar( {
		getLabel: () => __( "Title", "admin-ui" ),
	} ),
	/**
	 * Represents the search title replacement variable.
	 *
	 * @returns {Object} The title replacement variable.
	 */
	searchPages: createTitleReplacevar( {
		getLabel: () => __( "Search title", "admin-ui" ),
	} ),
	/**
	 * Represents the not found title replacement variable.
	 *
	 * @returns {Object} The title replacement variable.
	 */
	notFoundPages: createTitleReplacevar( {
		getLabel: () => __( "Page not found", "admin-ui" ),
	} ),
};

/**
 * Represents the title replacement variable.
 *
 * @returns {Object} The title replacement variable.
 */
export const title = createTitleReplacevar( {
	getLabel: () => __( "Title", "admin-ui" ),
} );

/**
 * Represents the collection title replacement variable.
 *
 * @returns {Object} The collection title replacement variable.
 */
export const collectionTitle = createCollectionTitleReplacevar( {
	getLabel: () => __( "Collection title", "admin-ui" ),
} );

/**
 * Represents the product tags replacement variable.
 *
 * @returns {Object} The product tags replacement variable.
 */
export const productTags = createProductTagsReplacevar( {
	getLabel: () => __( "Product tags", "admin-ui" ),
} );

/**
 * Represents the blog title replacement variable.
 *
 * @returns {Object} The blog title replacement variable.
 */
export const blogTitle = createBlogTitleReplacevar( {
	getLabel: () => __( "Blog title", "admin-ui" ),
} );

/**
 * Represents the post tags replacement variable.
 *
 * @returns {Object} The post tags replacement variable.
 */
export const postTags = createPostTagsReplacevar( {
	getLabel: () => __( "Post tags", "admin-ui" ),
} );

/**
 * Represents the page number replacement variable (in a paginated context).
 *
 * @returns {Object} The page number replacement variable.
 */
export const pageNumber = createPageNumberReplacevar( {
	getLabel: () => __( "Page number", "admin-ui" ),
} );

/**
 * Represents the separator replacement variable.
 *
 * @returns {Object} The separator replacement variable.
 */
export const separator = createSeparatorReplacevar( {
	getLabel: () => __( "Separator", "admin-ui" ),
} );

/**
 * Represents the search phrase replacement variable (on search result pages).
 *
 * @returns {Object} The search phrase replacement variable.
 */
export const searchPhrase = createSearchPhraseReplacevar( {
	getLabel: () => __( "Search phrase", "admin-ui" ),
} );

/**
 * Represents the search result count replacement variable (on search result pages).
 *
 * @returns {Object} The search result count replacement variable.
 */
export const searchResultsCount = createSearchResultsCountReplacevar( {
	getLabel: () => __( "Search results count", "admin-ui" ),
} );

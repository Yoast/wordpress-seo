import { select } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { decodeSeparator } from "@yoast/admin-ui-toolkit/helpers";
import {
	createBlogTitleReplacevar,
	createCollectionTitleReplacevar,
	createFocusKeyphraseReplacevar,
	createPageNumberReplacevar,
	createPageTotalReplacevar,
	createPostTagsReplacevar,
	createProductTagsReplacevar,
	createSearchPhraseReplacevar,
	createSearchResultsCountReplacevar,
	createSeparatorReplacevar,
	createSitenameReplacevar,
	createTitleReplacevar,
} from "@yoast/admin-ui-toolkit/helpers/replacevars";
import { join } from "lodash";
import { OPTIMIZE_STORE_KEY } from "../constants";

export const detail = {
	focusKeyphrase: createFocusKeyphraseReplacevar( {
		getLabel: () => __( "Focus keyphrase", "admin-ui" ),
		getReplacement: () => select( OPTIMIZE_STORE_KEY ).getData( "keyphrases.focus" ) || "",
	} ),
	title: createTitleReplacevar( {
		getLabel: () => __( "Title", "admin-ui" ),
		getReplacement: () => select( OPTIMIZE_STORE_KEY ).getData( "title" ) || "",
	} ),
	collectionTitle: createCollectionTitleReplacevar( {
		getLabel: () => __( "Collection title", "admin-ui" ),
		getReplacement: () => select( OPTIMIZE_STORE_KEY ).getData( "collectionTitle" ) || "",
	} ),
	productTags: createProductTagsReplacevar( {
		getLabel: () => __( "Product tags", "admin-ui" ),
		getReplacement: () => join( select( OPTIMIZE_STORE_KEY ).getData( "tags" ), ", " ),
	} ),
	blogTitle: createBlogTitleReplacevar( {
		getLabel: () => __( "Blog title", "admin-ui" ),
		getReplacement: () => select( OPTIMIZE_STORE_KEY ).getMetadata( "blogTitle" ) || "",
	} ),
	postTags: createPostTagsReplacevar( {
		getLabel: () => __( "Post tags", "admin-ui" ),
		getReplacement: () => join( select( OPTIMIZE_STORE_KEY ).getData( "tags" ), ", " ),
	} ),
};

export const list = {
	focusKeyphrase: createFocusKeyphraseReplacevar( {
		getLabel: () => __( "Focus keyphrase", "admin-ui" ),
		getReplacement: ( index ) => {
			return select( OPTIMIZE_STORE_KEY ).getListData( `items.${ index }.keyphrases.focus` ) || "";
		},
	} ),
	title: createTitleReplacevar( {
		getLabel: () => __( "Title", "admin-ui" ),
		getReplacement: ( index ) => {
			return select( OPTIMIZE_STORE_KEY ).getListData( `items.${ index }.title` ) || "";
		},
	} ),
	collectionTitle: createCollectionTitleReplacevar( {
		getLabel: () => __( "Collection title", "admin-ui" ),
		getReplacement: ( index ) => {
			return select( OPTIMIZE_STORE_KEY ).getListData( `items.${ index }.collectionTitle` ) || "";
		},
	} ),
	productTags: createProductTagsReplacevar( {
		getLabel: () => __( "Product tags", "admin-ui" ),
		getReplacement: ( index ) => {
			return join( select( OPTIMIZE_STORE_KEY ).getListData( `items.${ index }.tags`, ", " ) );
		},
	} ),
	blogTitle: createBlogTitleReplacevar( {
		getLabel: () => __( "Blog title", "admin-ui" ),
		getReplacement: ( index ) => {
			return select( OPTIMIZE_STORE_KEY ).getListData( `items.${ index }.blogTitle` ) || "";
		},
	} ),
	postTags: createPostTagsReplacevar( {
		getLabel: () => __( "Post tags", "admin-ui" ),
		getReplacement: ( index ) => {
			return join( select( OPTIMIZE_STORE_KEY ).getListData( `items.${ index }.tags`, ", " ) );
		},
	} ),
};

/**
 * Represents the site name replacement variable.
 *
 * @returns {Object} The site name replacement variable.
 */
export const siteName = createSitenameReplacevar( {
	getLabel: () => __( "Site title", "admin-ui" ),
	getReplacement: () => select( OPTIMIZE_STORE_KEY ).getOption( "siteName" ),
} );

/**
 * Represents the page number replacement variable (in a paginated context).
 *
 * @returns {Object} The page number replacement variable.
 */
export const pageNumber = createPageNumberReplacevar( {
	getLabel: () => __( "Page number", "admin-ui" ),
	getReplacement: () => "",
} );

/**
 * Represents the page total replacement variable (in a paginated context).
 *
 * @returns {Object} The page total replacement variable.
 */
export const pageTotal = createPageTotalReplacevar( {
	getLabel: () => __( "Page total", "admin-ui" ),
	getReplacement: () => "",
} );

/**
 * Represents the separator replacement variable.
 *
 * @returns {Object} The separator replacement variable.
 */
export const separator = createSeparatorReplacevar( {
	getLabel: () => __( "Separator", "admin-ui" ),
	getReplacement: () => {
		const encodedSeparator = select( OPTIMIZE_STORE_KEY ).getSetting( "siteSettings.siteDefaults.separator" );
		return decodeSeparator( encodedSeparator );
	},
} );

/**
 * Represents the search phrase replacement variable (on search result pages).
 *
 * @returns {Object} The search phrase replacement variable.
 */
export const searchPhrase = createSearchPhraseReplacevar( {
	getLabel: () => __( "Search phrase", "admin-ui" ),
	getReplacement: () => "",
} );

/**
 * Represents the search result count replacement variable (on search result pages).
 *
 * @returns {Object} The search result count replacement variable.
 */
export const searchResultsCount = createSearchResultsCountReplacevar( {
	getLabel: () => __( "Search results count", "admin-ui" ),
	getReplacement: () => "",
} );

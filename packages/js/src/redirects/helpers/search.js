/* eslint-disable camelcase */
import { __ } from "@wordpress/i18n";

/**
 * @returns {Object} The search index.
 */
export const createSearchIndex = () => ( {
	redirects_type_plain: {
		route: "/",
		routeLabel: __( "Redirects", "wordpress-seo" ),
		fieldId: "yst-input-type-plain",
		fieldLabel: __( "Redirect Type", "wordpress-seo" ),
		keywords: [],
	},
	redirects_origin_plain: {
		route: "/",
		routeLabel: __( "Redirects", "wordpress-seo" ),
		fieldId: "yst-input-origin-plain",
		fieldLabel: __( "Old URL", "wordpress-seo" ),
		keywords: [],
	},
	redirects_target_plain: {
		route: "/",
		routeLabel: __( "Redirects", "wordpress-seo" ),
		fieldId: "yst-input-target-plain",
		fieldLabel: __( "New URL", "wordpress-seo" ),
		keywords: [],
	},
	redirects_type_regex: {
		route: "/regex-redirects",
		routeLabel: __( "Regex redirects", "wordpress-seo" ),
		fieldId: "yst-input-type-regex",
		fieldLabel: __( "Redirect Type", "wordpress-seo" ),
		keywords: [],
	},
	redirects_origin_regex: {
		route: "/regex-redirects",
		routeLabel: __( "Regex redirects", "wordpress-seo" ),
		fieldId: "yst-input-origin-regex",
		fieldLabel: __( "Old URL", "wordpress-seo" ),
		keywords: [],
	},
	redirects_target_regex: {
		route: "/regex-redirects",
		routeLabel: __( "Regex redirects", "wordpress-seo" ),
		fieldId: "yst-input-target-regex",
		fieldLabel: __( "New URL", "wordpress-seo" ),
		keywords: [],
	},
	redirects_search_plain: {
		route: "/",
		routeLabel: __( "Redirects", "wordpress-seo" ),
		fieldId: "yst-search-redirects-plain",
		fieldLabel: "",
		keywords: [
			__( "Search…", "wordpress-seo" ),
		],
	},
	redirects_filter_plain: {
		route: "/",
		routeLabel: __( "Redirects", "wordpress-seo" ),
		fieldId: "yst-filter-redirect-type-plain",
		fieldLabel: __( "Filter Redirect type", "wordpress-seo" ),
		keywords: [],
	},
	redirects_bulk_actions_plain: {
		route: "/",
		routeLabel: __( "Redirects", "wordpress-seo" ),
		fieldId: "yst-bulk-actions-plain",
		fieldLabel: __( "Bulk actions", "wordpress-seo" ),
		keywords: [],
	},
	redirects_search_regex: {
		route: "/regex-redirects",
		routeLabel: __( "Regex redirects", "wordpress-seo" ),
		fieldId: "yst-search-redirects-regex",
		fieldLabel: "",
		keywords: [],
	},
	redirects_filter_regex: {
		route: "/regex-redirects",
		routeLabel: __( "Regex redirects", "wordpress-seo" ),
		fieldId: "yst-filter-redirect-type-plain",
		fieldLabel: __( "Filter Redirect type", "wordpress-seo" ),
		keywords: [],
	},
	redirects_bulk_actions_regex: {
		route: "/regex-redirects",
		routeLabel: __( "Regex redirects", "wordpress-seo" ),
		fieldId: "yst-bulk-actions-regex",
		fieldLabel: __( "Bulk actions", "wordpress-seo" ),
		keywords: [],
	},
	redirect_method: {
		route: "/redirect-method",
		routeLabel: __( "Redirect Methods", "wordpress-seo" ),
		fieldId: "yst-input-php-disable_php_redirect",
		fieldLabel: __( "Redirect Method", "wordpress-seo" ),
		keywords: [
			__( "PHP", "wordpress-seo" ),
			__( "Web Server", "wordpress-seo" ),
		],
	},
	separate_file: {
		route: "/redirect-method",
		routeLabel: __( "Redirect Methods", "wordpress-seo" ),
		fieldId: "yst-input-separate_file-off",
		fieldLabel: __( "Generate a separate redirect file", "wordpress-seo" ),
		keywords: [
			__( "Enabled", "wordpress-seo" ),
			__( "Disabled", "wordpress-seo" ),
		],
	},
} );

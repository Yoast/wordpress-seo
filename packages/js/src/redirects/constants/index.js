import { __ } from "@wordpress/i18n";

/**
 * Keep constants centralized to avoid circular dependency problems.
 */
export const STORE_NAME = "@yoast/redirects";

/**
 * Options for redirect select
 */
export const REDIRECT_TYPE_OPTIONS = [
	{ value: 301, label: __( "301 Moved Permatently", "wordpress-seo" ) },
	{ value: 302, label: __( "302 Found", "wordpress-seo" ) },
	{ value: 307, label: __( "307 Temporary Redirect", "wordpress-seo" ) },
	{ value: 410, label: __( "410 Content Deleted", "wordpress-seo" ) },
	{ value: 451, label: __( "451 Unavailable For Legal Reasons", "wordpress-seo" ) },
];

/**
 * Options for redirect select
 */
export const REDIRECT_TYPE_SHORTS_OPTIONS = [
	{ value: 301, label: __( "301", "wordpress-seo" ) },
	{ value: 302, label: __( "302", "wordpress-seo" ) },
	{ value: 307, label: __( "307", "wordpress-seo" ) },
	{ value: 410, label: __( "410", "wordpress-seo" ) },
	{ value: 451, label: __( "451", "wordpress-seo" ) },
];

export const BULK_ACTIONS_OPTIONS = [
	{ value: "", label: __( "All", "wordpress-seo" ) },
	{ value: "delete", label: __( "Delete", "wordpress-seo" ) },
];

export const ROUTES = {
	redirects: "/",
	regexRedirects: "/regex-redirects",
	redirectMethod: "/redirect-method",
};

export const ASC = "asc";
export const DESC = "desc";
export const FORMAT_PLAIN = "plain";
export const FORMAT_REGEX = "regex";

export const initialValues = {
	type: REDIRECT_TYPE_OPTIONS[ 0 ]?.value,
	origin: "",
	target: "",
	format: FORMAT_PLAIN,
};

export const initialRegexValues = {
	...initialValues,
	format: FORMAT_REGEX,
};

export const ITEMS_PER_PAGE = 10;

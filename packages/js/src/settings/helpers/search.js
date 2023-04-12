/* eslint-disable camelcase */
import { __, sprintf } from "@wordpress/i18n";
import { filter, includes, isEmpty, omit, reduce, times } from "lodash";
import { safeToLocaleLower } from "./i18n";

/**
 * @param {Object} postType The post type.
 * @param {Object} options The options.
 * @param {string} options.userLocale The user locale string.
 * @returns {Object} The search index for the post type.
 */
export const createPostTypeSearchIndex = ( { name, label, route, hasArchive }, { userLocale } ) => ( {
	[ `title-${ name }` ]: {
		route: `/settings/post-type/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-title-${ name }`,
		fieldLabel: __( "SEO title", "wordpress-seo" ),
		keywords: [],
	},
	[ `metadesc-${ name }` ]: {
		route: `/settings/post-type/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-metadesc-${ name }`,
		fieldLabel: __( "Meta description", "wordpress-seo" ),
		keywords: [],
	},
	[ `noindex-${ name }` ]: {
		route: `/settings/post-type/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-noindex-${ name }`,
		fieldLabel: sprintf(
			// translators: %1$s expands to the post type plural, e.g. Posts.
			__( "Show %1$s in search results", "wordpress-seo" ),
			safeToLocaleLower( label, userLocale )
		),
		keywords: [],
	},
	[ `display-metabox-pt-${ name }` ]: {
		route: `/settings/post-type/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-display-metabox-pt-${ name }`,
		fieldLabel: __( "Enable SEO controls and assessments", "wordpress-seo" ),
		keywords: [],
	},
	[ `schema-page-type-${ name }` ]: {
		route: `/settings/post-type/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-schema-page-type-${ name }`,
		fieldLabel: __( "Page type", "wordpress-seo" ),
		keywords: [
			__( "Schema", "wordpress-seo" ),
			__( "Structured data", "wordpress-seo" ),
		],
	},
	[ `schema-article-type-${ name }` ]: {
		route: `/settings/post-type/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-schema-article-type-${ name }`,
		fieldLabel: __( "Article type", "wordpress-seo" ),
		keywords: [
			__( "Schema", "wordpress-seo" ),
			__( "Structured data", "wordpress-seo" ),
		],
	},
	[ `page-analyse-extra-${ name }` ]: {
		route: `/settings/post-type/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-page-analyse-extra-${ name }`,
		fieldLabel: __( "Add custom fields to page analysis", "wordpress-seo" ),
		keywords: [],
	},
	...( name !== "attachment" && {
		[ `social-title-${ name }` ]: {
			route: `/settings/post-type/${ route }`,
			routeLabel: label,
			fieldId: `input-wpseo_titles-social-title-${ name }`,
			fieldLabel: __( "Social title", "wordpress-seo" ),
			keywords: [],
		},
		[ `social-description-${ name }` ]: {
			route: `/settings/post-type/${ route }`,
			routeLabel: label,
			fieldId: `input-wpseo_titles-social-description-${ name }`,
			fieldLabel: __( "Social description", "wordpress-seo" ),
			keywords: [],
		},
		[ `social-image-id-${ name }` ]: {
			route: `/settings/post-type/${ route }`,
			routeLabel: label,
			fieldId: `button-wpseo_titles-social-image-${ name }-preview`,
			fieldLabel: __( "Social image", "wordpress-seo" ),
			keywords: [],
		},
	} ),
	...( hasArchive && {
		[ `title-ptarchive-${ name }` ]: {
			route: `/settings/post-type/${ route }`,
			routeLabel: label,
			fieldId: `input-wpseo_titles-title-ptarchive-${ name }`,
			fieldLabel: __( "Archive SEO title", "wordpress-seo" ),
			keywords: [],
		},
		[ `metadesc-ptarchive-${ name }` ]: {
			route: `/settings/post-type/${ route }`,
			routeLabel: label,
			fieldId: `input-wpseo_titles-metadesc-ptarchive-${ name }`,
			fieldLabel: __( "Archive meta description", "wordpress-seo" ),
			keywords: [],
		},
		[ `bctitle-ptarchive-${ name }` ]: {
			route: `/settings/post-type/${ route }`,
			routeLabel: label,
			fieldId: `input-wpseo_titles-bctitle-ptarchive-${ name }`,
			fieldLabel: __( "Archive breadcrumbs title", "wordpress-seo" ),
			keywords: [],
		},
		[ `noindex-ptarchive-${ name }` ]: {
			route: `/settings/post-type/${ route }`,
			routeLabel: label,
			fieldId: `input-wpseo_titles-noindex-ptarchive-${ name }`,
			fieldLabel: sprintf(
				// translators: %1$s expands to the post type plural, e.g. Posts.
				__( "Show the archive for %1$s in search results", "wordpress-seo" ),
				safeToLocaleLower( label, userLocale )
			),
			keywords: [],
		},
		[ `social-title-ptarchive-${ name }` ]: {
			route: `/settings/post-type/${ route }`,
			routeLabel: label,
			fieldId: `input-wpseo_titles-social-title-ptarchive-${ name }`,
			fieldLabel: __( "Archive social title", "wordpress-seo" ),
			keywords: [],
		},
		[ `social-description-ptarchive-${ name }` ]: {
			route: `/settings/post-type/${ route }`,
			routeLabel: label,
			fieldId: `input-wpseo_titles-social-description-ptarchive-${ name }`,
			fieldLabel: __( "Archive social description", "wordpress-seo" ),
			keywords: [],
		},
		[ `social-image-id-ptarchive-${ name }` ]: {
			route: `/settings/post-type/${ route }`,
			routeLabel: label,
			fieldId: `button-wpseo_titles-social-image-ptarchive-${ name }-preview`,
			fieldLabel: __( "Archive social image", "wordpress-seo" ),
			keywords: [],
		},
	} ),
} );

/**
 * @param {Object} taxonomy The taxonomy.
 * @param {Object} options The options.
 * @param {string} options.userLocale The user locale string.
 * @returns {Object} The search index for the taxonomy.
 */
export const createTaxonomySearchIndex = ( { name, label, route }, { userLocale } ) => ( {
	[ `title-tax-${ name }` ]: {
		route: `/settings/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-title-tax-${ name }`,
		fieldLabel: __( "SEO title", "wordpress-seo" ),
		keywords: [],
	},
	[ `metadesc-tax-${ name }` ]: {
		route: `/settings/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-metadesc-tax-${ name }`,
		fieldLabel: __( "Meta description", "wordpress-seo" ),
		keywords: [],
	},
	[ `display-metabox-tax-${ name }` ]: {
		route: `/settings/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-display-metabox-tax-${ name }`,
		fieldLabel: sprintf(
			/* translators: %1$s expands to "Yoast SEO". %2$s expands to the taxonomy plural, e.g. Categories. */
			__( "Enable %1$s for %2$s", "wordpress-seo" ),
			"Yoast SEO",
			safeToLocaleLower( label, userLocale )
		),
		keywords: [],
	},
	[ `display-metabox-tax-${ name }` ]: {
		route: `/settings/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-display-metabox-tax-${ name }`,
		fieldLabel: __( "Enable SEO controls and assessments", "wordpress-seo" ),
		keywords: [],
	},
	[ `noindex-tax-${ name }` ]: {
		route: `/settings/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-noindex-tax-${ name }`,
		fieldLabel: sprintf(
			// translators: %1$s expands to the taxonomy plural, e.g. Categories.
			__( "Show %1$s in search results", "wordpress-seo" ),
			safeToLocaleLower( label, userLocale )
		),
		keywords: [],
	},
	[ `social-title-tax-${ name }` ]: {
		route: `/settings/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-social-title-tax-${ name }`,
		fieldLabel: __( "Social title", "wordpress-seo" ),
		keywords: [],
	},
	[ `social-description-tax-${ name }` ]: {
		route: `/settings/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `input-wpseo_titles-social-description-tax-${ name }`,
		fieldLabel: __( "Social description", "wordpress-seo" ),
		keywords: [],
	},
	[ `social-image-id-tax-${ name }` ]: {
		route: `/settings/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `button-wpseo_titles-social-image-tax-${ name }-preview`,
		fieldLabel: __( "Social image", "wordpress-seo" ),
		keywords: [],
	},
	...( name === "category" && {
		stripcategorybase: {
			route: `/settings/taxonomy/${ route }`,
			routeLabel: label,
			fieldId: "input-wpseo_titles-stripcategorybase",
			fieldLabel: __( "Show the categories prefix in the slug", "wordpress-seo" ),
			keywords: [],
		},
	} ),
} );

/**
 * @param {Object} postTypes The post types.
 * @param {Object} taxonomies The taxonomies.
 * @param {Object} options The options.
 * @param {string} options.userLocale The user locale string.
 * @returns {Object} The search index.
 */
export const createSearchIndex = ( postTypes, taxonomies, { userLocale } = {} ) => ( {
	blogdescription: {
		route: "/settings/site-basics",
		routeLabel: __( "Site basics", "wordpress-seo" ),
		fieldId: "input-blogdescription",
		fieldLabel: __( "Tagline", "wordpress-seo" ),
		keywords: [],
	},
	wpseo: {
		keyword_analysis_active: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-keyword_analysis_active",
			fieldLabel: __( "SEO analysis", "wordpress-seo" ),
			keywords: [],
		},
		content_analysis_active: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-content_analysis_active",
			fieldLabel: __( "Readability analysis", "wordpress-seo" ),
			keywords: [],
		},
		inclusive_language_analysis_active: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-inclusive_language_analysis_active",
			fieldLabel: __( "Inclusive language analysis", "wordpress-seo" ),
			keywords: [],
		},
		enable_metabox_insights: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_metabox_insights",
			fieldLabel: __( "Insights", "wordpress-seo" ),
			keywords: [],
		},
		enable_cornerstone_content: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_cornerstone_content",
			fieldLabel: __( "Cornerstone content", "wordpress-seo" ),
			keywords: [],
		},
		enable_text_link_counter: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_text_link_counter",
			fieldLabel: __( "Text link counter", "wordpress-seo" ),
			keywords: [],
		},
		enable_link_suggestions: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_link_suggestions",
			fieldLabel: __( "Link suggestions", "wordpress-seo" ),
			keywords: [],
		},
		enable_enhanced_slack_sharing: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_enhanced_slack_sharing",
			fieldLabel: __( "Slack sharing", "wordpress-seo" ),
			keywords: [
				__( "Share", "wordpress-seo" ),
			],
		},
		enable_admin_bar_menu: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_admin_bar_menu",
			fieldLabel: __( "Admin bar menu", "wordpress-seo" ),
			keywords: [],
		},
		enable_headless_rest_endpoints: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_headless_rest_endpoints",
			fieldLabel: __( "REST API endpoint", "wordpress-seo" ),
			keywords: [],
		},
		enable_xml_sitemap: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_xml_sitemap",
			fieldLabel: __( "XML sitemaps", "wordpress-seo" ),
			keywords: [],
		},
		enable_index_now: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_index_now",
			fieldLabel: __( "IndexNow", "wordpress-seo" ),
			keywords: [
				__( "Index Now", "wordpress-seo" ),
			],
		},
		disableadvanced_meta: {
			route: "/settings/site-basics",
			routeLabel: __( "Site basics", "wordpress-seo" ),
			fieldId: "input-wpseo-disableadvanced_meta",
			fieldLabel: __( "Restrict advanced settings for authors", "wordpress-seo" ),
			keywords: [],
		},
		tracking: {
			route: "/settings/site-basics",
			routeLabel: __( "Site basics", "wordpress-seo" ),
			fieldId: "input-wpseo-tracking",
			fieldLabel: __( "Usage tracking", "wordpress-seo" ),
			keywords: [],
		},
		baiduverify: {
			route: "/settings/site-connections",
			routeLabel: __( "Site connections", "wordpress-seo" ),
			fieldId: "input-wpseo-baiduverify",
			fieldLabel: __( "Baidu", "wordpress-seo" ),
			keywords: [
				__( "Webmaster", "wordpress-seo" ),
			],
		},
		googleverify: {
			route: "/settings/site-connections",
			routeLabel: __( "Site connections", "wordpress-seo" ),
			fieldId: "input-wpseo-googleverify",
			fieldLabel: __( "Google", "wordpress-seo" ),
			keywords: [
				__( "Webmaster", "wordpress-seo" ),
				__( "Google search console", "wordpress-seo" ),
				"gsc",
			],
		},
		msverify: {
			route: "/settings/site-connections",
			routeLabel: __( "Site connections", "wordpress-seo" ),
			fieldId: "input-wpseo-msverify",
			fieldLabel: __( "Bing", "wordpress-seo" ),
			keywords: [
				__( "Webmaster", "wordpress-seo" ),
			],
		},
		yandexverify: {
			route: "/settings/site-connections",
			routeLabel: __( "Site connections", "wordpress-seo" ),
			fieldId: "input-wpseo-yandexverify",
			fieldLabel: __( "Yandex", "wordpress-seo" ),
			keywords: [
				__( "Webmaster", "wordpress-seo" ),
			],
		},
		remove_shortlinks: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_shortlinks",
			fieldLabel: __( "Remove shortlinks", "wordpress-seo" ),
			keywords: [],
		},
		remove_rest_api_links: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_rest_api_links",
			fieldLabel: __( "Remove REST API links", "wordpress-seo" ),
			keywords: [],
		},
		remove_rsd_wlw_links: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_rsd_wlw_links",
			fieldLabel: __( "Remove RSD / WLW links", "wordpress-seo" ),
			keywords: [],
		},
		remove_oembed_links: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_oembed_links",
			fieldLabel: __( "Remove oEmbed links", "wordpress-seo" ),
			keywords: [],
		},
		remove_generator: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_generator",
			fieldLabel: __( "Remove generator tag", "wordpress-seo" ),
			keywords: [],
		},
		remove_pingback_header: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_pingback_header",
			fieldLabel: __( "Pingback HTTP header", "wordpress-seo" ),
			keywords: [],
		},
		remove_powered_by_header: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_powered_by_header",
			fieldLabel: __( "Remove powered by HTTP header", "wordpress-seo" ),
			keywords: [],
		},
		remove_feed_global: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_feed_global",
			fieldLabel: __( "Remove global feed", "wordpress-seo" ),
			keywords: [],
		},
		remove_feed_global_comments: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_feed_global_comments",
			fieldLabel: __( "Remove global comment feeds", "wordpress-seo" ),
			keywords: [],
		},
		remove_feed_post_comments: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_feed_post_comments",
			fieldLabel: __( "Remove post comments feeds", "wordpress-seo" ),
			keywords: [],
		},
		remove_feed_authors: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_feed_authors",
			fieldLabel: __( "Remove post authors feeds", "wordpress-seo" ),
			keywords: [],
		},
		remove_feed_post_types: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_feed_post_types",
			fieldLabel: __( "Remove post type feeds", "wordpress-seo" ),
			keywords: [],
		},
		remove_feed_categories: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_feed_categories",
			fieldLabel: __( "Remove category feeds", "wordpress-seo" ),
			keywords: [],
		},
		remove_feed_tags: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_feed_tags",
			fieldLabel: __( "Remove tag feeds", "wordpress-seo" ),
			keywords: [],
		},
		remove_feed_custom_taxonomies: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_feed_custom_taxonomies",
			fieldLabel: __( "Remove custom taxonomy feeds", "wordpress-seo" ),
			keywords: [],
		},
		remove_feed_search: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_feed_search",
			fieldLabel: __( "Remove search results feeds", "wordpress-seo" ),
			keywords: [],
		},
		remove_atom_rdf_feeds: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_atom_rdf_feeds",
			fieldLabel: __( "Remove Atom/RDF feeds", "wordpress-seo" ),
			keywords: [],
		},
		remove_emoji_scripts: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-remove_emoji_scripts",
			fieldLabel: __( "Remove emoji scripts", "wordpress-seo" ),
			keywords: [],
		},
		deny_wp_json_crawling: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-deny_wp_json_crawling",
			fieldLabel: __( "Remove WP-JSON API", "wordpress-seo" ),
			keywords: [],
		},
		search_cleanup: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-search_cleanup",
			fieldLabel: __( "Filter search terms", "wordpress-seo" ),
			keywords: [],
		},
		search_character_limit: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-search_character_limit",
			fieldLabel: __( "Max number of characters to allow in searches", "wordpress-seo" ),
			keywords: [],
		},
		search_cleanup_emoji: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-search_cleanup_emoji",
			fieldLabel: __( "Filter searches with emojis and other special characters", "wordpress-seo" ),
			keywords: [],
		},
		search_cleanup_patterns: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-search_cleanup_patterns",
			fieldLabel: __( "Filter searches with common spam patterns", "wordpress-seo" ),
			keywords: [],
		},
		redirect_search_pretty_urls: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-redirect_search_pretty_urls",
			fieldLabel: __( "Redirect pretty URLs to ‘raw’ formats", "wordpress-seo" ),
			keywords: [],
		},
		deny_search_crawling: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-deny_search_crawling",
			fieldLabel: __( "Prevent crawling of internal site search URLs", "wordpress-seo" ),
			keywords: [],
		},
		clean_campaign_tracking_urls: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-clean_campaign_tracking_urls",
			fieldLabel: __( "Optimize Google Analytics utm tracking parameters", "wordpress-seo" ),
			keywords: [],
		},
		clean_permalinks: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-clean_permalinks",
			fieldLabel: __( "Remove unregistered URL parameters", "wordpress-seo" ),
			keywords: [],
		},
		clean_permalinks_extra_variables: {
			route: "/settings/crawl-optimization",
			routeLabel: __( "Crawl optimization", "wordpress-seo" ),
			fieldId: "input-wpseo-clean_permalinks_extra_variables",
			fieldLabel: __( "Additional URL parameters to allow", "wordpress-seo" ),
			keywords: [],
		},
	},
	wpseo_titles: {
		website_name: {
			route: "/settings/site-basics",
			routeLabel: __( "Site basics", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-website_name",
			fieldLabel: __( "Website name", "wordpress-seo" ),
			keywords: [],
		},
		alternate_website_name: {
			route: "/settings/site-basics",
			routeLabel: __( "Site basics", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-alternate_website_name",
			fieldLabel: __( "Alternate website name", "wordpress-seo" ),
			keywords: [],
		},
		forcerewritetitles: {
			route: "/settings/site-basics",
			routeLabel: __( "Site basics", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-forcerewritetitle",
			fieldLabel: __( "Force rewrite titles", "wordpress-seo" ),
			keywords: [],
		},
		separator: {
			route: "/settings/site-basics",
			routeLabel: __( "Site basics", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-separator-sc-dash",
			fieldLabel: __( "Title separator", "wordpress-seo" ),
			keywords: [
				__( "Divider", "wordpress-seo" ),
			],
		},
		company_or_person: {
			route: "/settings/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-company_or_person-company",
			fieldLabel: __( "Organization/person", "wordpress-seo" ),
			keywords: [
				__( "Schema", "wordpress-seo" ),
				__( "Structured data", "wordpress-seo" ),
			],
		},
		company_name: {
			route: "/settings/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-company_name",
			fieldLabel: __( "Organization name", "wordpress-seo" ),
			keywords: [],
		},
		company_alternate_name: {
			route: "/settings/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-company_alternate_name",
			fieldLabel: __( "Alternate organization name", "wordpress-seo" ),
			keywords: [],
		},
		company_logo_id: {
			route: "/settings/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-company_logo-preview",
			fieldLabel: __( "Organization logo", "wordpress-seo" ),
			keywords: [
				__( "Image", "wordpress-seo" ),
			],
		},
		company_or_person_user_id: {
			route: "/settings/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-company_or_person_user_id",
			fieldLabel: __( "User", "wordpress-seo" ),
			keywords: [],
		},
		person_logo_id: {
			route: "/settings/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-person_logo-preview",
			fieldLabel: __( "Personal logo or avatar", "wordpress-seo" ),
			keywords: [
				__( "Image", "wordpress-seo" ),
			],
		},
		"title-home-wpseo": {
			route: "/settings/homepage",
			routeLabel: __( "Homepage", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-title-home-wpseo",
			fieldLabel: __( "SEO title", "wordpress-seo" ),
			keywords: [],
		},
		"metadesc-home-wpseo": {
			route: "/settings/homepage",
			routeLabel: __( "Homepage", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-metadesc-home-wpseo",
			fieldLabel: __( "Meta description", "wordpress-seo" ),
			keywords: [],
		},
		open_graph_frontpage_image_id: {
			route: "/settings/homepage",
			routeLabel: __( "Homepage", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-open_graph_frontpage_image-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
			keywords: [],
		},
		open_graph_frontpage_title: {
			route: "/settings/homepage",
			routeLabel: __( "Homepage", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-open_graph_frontpage_title",
			fieldLabel: __( "Social title", "wordpress-seo" ),
			keywords: [],
		},
		open_graph_frontpage_desc: {
			route: "/settings/homepage",
			routeLabel: __( "Homepage", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-open_graph_frontpage_desc",
			fieldLabel: __( "Social description", "wordpress-seo" ),
			keywords: [],
		},
		"breadcrumbs-sep": {
			route: "/settings/breadcrumbs",
			routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-breadcrumbs-sep",
			fieldLabel: __( "Separator between breadcrumbs", "wordpress-seo" ),
			keywords: [
				__( "Divider", "wordpress-seo" ),
				__( "Separator", "wordpress-seo" ),
			],
		},
		"breadcrumbs-home": {
			route: "/settings/breadcrumbs",
			routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-breadcrumbs-home",
			fieldLabel: __( "Anchor text for the homepage", "wordpress-seo" ),
			keywords: [],
		},
		"breadcrumbs-prefix": {
			route: "/settings/breadcrumbs",
			routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-breadcrumbs-prefix",
			fieldLabel: __( "Prefix for the breadcrumb path", "wordpress-seo" ),
			keywords: [],
		},
		"breadcrumbs-archiveprefix": {
			route: "/settings/breadcrumbs",
			routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-breadcrumbs-archiveprefix",
			fieldLabel: __( "Prefix for archive breadcrumbs", "wordpress-seo" ),
			keywords: [],
		},
		"breadcrumbs-searchprefix": {
			route: "/settings/breadcrumbs",
			routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-breadcrumbs-searchprefix",
			fieldLabel: __( "Prefix for search page breadcrumbs", "wordpress-seo" ),
			keywords: [],
		},
		"breadcrumbs-404crumb": {
			route: "/settings/breadcrumbs",
			routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-breadcrumbs-404crumb",
			fieldLabel: __( "Breadcrumb for 404 page", "wordpress-seo" ),
			keywords: [],
		},
		"breadcrumbs-display-blog-page": {
			route: "/settings/breadcrumbs",
			routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-breadcrumbs-display-blog-page",
			fieldLabel: __( "Show blog page in breadcrumbs", "wordpress-seo" ),
			keywords: [],
		},
		"breadcrumbs-boldlast": {
			route: "/settings/breadcrumbs",
			routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-breadcrumbs-boldlast",
			fieldLabel: __( "Bold the last page", "wordpress-seo" ),
			keywords: [],
		},
		"breadcrumbs-enable": {
			route: "/settings/breadcrumbs",
			routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-breadcrumbs-enable",
			fieldLabel: __( "Enable breadcrumbs for your theme", "wordpress-seo" ),
			keywords: [],
		},
		...reduce( postTypes, ( acc, postType ) => {
			const isTaxLinked = filter( taxonomies, taxonomy => includes( taxonomy.postTypes, postType.name ) );

			return isEmpty( isTaxLinked ) ? acc : ( {
				...acc,
				[ `post_types-${ postType.name }-maintax` ]: {
					route: "/settings/breadcrumbs",
					routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
					fieldId: `input-wpseo_titles-post_types-${ postType.name }-maintax`,
					// translators: %1$s expands to the post type plural, e.g. posts.
					fieldLabel: sprintf( __( "Breadcrumbs for %1$s", "wordpress-seo" ), safeToLocaleLower( postType.label, userLocale ) ),
					keywords: [],
				},
			} );
		}, {} ),
		...reduce( taxonomies, ( acc, taxonomy ) => ( {
			...acc,
			[ `taxonomy-${ taxonomy.name }-ptparent` ]: {
				route: "/settings/breadcrumbs",
				routeLabel: __( "Breadcrumbs", "wordpress-seo" ),
				fieldId: `input-wpseo_titles-taxonomy-${ taxonomy.name }-ptparent`,
				// translators: %1$s expands to the taxonomy plural, e.g. categories.
				fieldLabel: sprintf( __( "Breadcrumbs for %1$s", "wordpress-seo" ), safeToLocaleLower( taxonomy.label, userLocale ) ),
				keywords: [],
			},
		} ), {} ),
		// Author archives
		"disable-author": {
			route: "/settings/author-archives",
			routeLabel: __( "Author archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-disable-author",
			fieldLabel: __( "Enable author archives", "wordpress-seo" ),
			keywords: [],
		},
		"noindex-author-wpseo": {
			route: "/settings/author-archives",
			routeLabel: __( "Author archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-noindex-author-wpseo",
			fieldLabel: __( "Show author archives in search results", "wordpress-seo" ),
			keywords: [],
		},
		"noindex-author-noposts-wpseo": {
			route: "/settings/author-archives",
			routeLabel: __( "Author archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-noindex-author-noposts-wpseo",
			fieldLabel: __( "Show archives for authors without posts in search results", "wordpress-seo" ),
			keywords: [],
		},
		"title-author-wpseo": {
			route: "/settings/author-archives",
			routeLabel: __( "Author archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-title-author-wpseo",
			fieldLabel: __( "SEO title", "wordpress-seo" ),
			keywords: [],
		},
		"metadesc-author-wpseo": {
			route: "/settings/author-archives",
			routeLabel: __( "Author archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-metadesc-author-wpseo",
			fieldLabel: __( "Meta description", "wordpress-seo" ),
			keywords: [],
		},
		"social-image-id-author-wpseo": {
			route: "/settings/author-archives",
			routeLabel: __( "Author archives", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-social-image-author-wpseo-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
			keywords: [],
		},
		"social-title-author-wpseo": {
			route: "/settings/author-archives",
			routeLabel: __( "Author archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-social-title-author-wpseo",
			fieldLabel: __( "Social title", "wordpress-seo" ),
			keywords: [],
		},
		"social-description-author-wpseo": {
			route: "/settings/author-archives",
			routeLabel: __( "Author archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-social-description-author-wpseo",
			fieldLabel: __( "Social description", "wordpress-seo" ),
			keywords: [],
		},
		// Date archives
		"disable-date": {
			route: "/settings/date-archives",
			routeLabel: __( "Date archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-disable-date",
			fieldLabel: __( "Enable date archives", "wordpress-seo" ),
			keywords: [],
		},
		"noindex-archive-wpseo": {
			route: "/settings/date-archives",
			routeLabel: __( "Date archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-noindex-archive-wpseo",
			fieldLabel: __( "Show date archives in search results", "wordpress-seo" ),
			keywords: [],
		},
		"title-archive-wpseo": {
			route: "/settings/date-archives",
			routeLabel: __( "Date archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-title-archive-wpseo",
			fieldLabel: __( "SEO title", "wordpress-seo" ),
			keywords: [],
		},
		"metadesc-archive-wpseo": {
			route: "/settings/date-archives",
			routeLabel: __( "Date archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-metadesc-archive-wpseo",
			fieldLabel: __( "Meta description", "wordpress-seo" ),
			keywords: [],
		},
		"social-image-id-archive-wpseo": {
			route: "/settings/date-archives",
			routeLabel: __( "Date archives", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-social-image-archive-wpseo-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
			keywords: [],
		},
		"social-title-archive-wpseo": {
			route: "/settings/date-archives",
			routeLabel: __( "Date archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-social-title-archive-wpseo",
			fieldLabel: __( "Social title", "wordpress-seo" ),
			keywords: [],
		},
		"social-description-archive-wpseo": {
			route: "/settings/date-archives",
			routeLabel: __( "Date archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-social-description-archive-wpseo",
			fieldLabel: __( "Social description", "wordpress-seo" ),
			keywords: [],
		},
		// Special pages
		"title-search-wpseo": {
			route: "/settings/special-pages",
			routeLabel: __( "Special pages", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-title-search-wpseo",
			fieldLabel: __( "Search pages title", "wordpress-seo" ),
			keywords: [],
		},
		"title-404-wpseo": {
			route: "/settings/special-pages",
			routeLabel: __( "Special pages", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-title-404-wpseo",
			fieldLabel: __( "404 pages title", "wordpress-seo" ),
			keywords: [],
		},
		// Media pages
		"disable-attachment": {
			route: "/settings/media-pages",
			routeLabel: __( "Media pages", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-disable-attachment",
			fieldLabel: __( "Media pages", "wordpress-seo" ),
			keywords: [
				__( "Attachment", "wordpress-seo" ),
				__( "Image", "wordpress-seo" ),
				__( "Video", "wordpress-seo" ),
				__( "PDF", "wordpress-seo" ),
				__( "File", "wordpress-seo" ),
			],
		},
		"noindex-attachment": {
			route: "/settings/media-pages",
			routeLabel: __( "Media pages", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-noindex-attachment",
			fieldLabel: __( "Show media pages in search results", "wordpress-seo" ),
			keywords: [
				__( "Image", "wordpress-seo" ),
				__( "Video", "wordpress-seo" ),
				__( "PDF", "wordpress-seo" ),
				__( "File", "wordpress-seo" ),
			],
		},
		"title-attachment": {
			route: "/settings/media-pages",
			routeLabel: __( "Media pages", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-title-attachment",
			fieldLabel: __( "SEO title", "wordpress-seo" ),
			keywords: [
				__( "Image", "wordpress-seo" ),
				__( "Video", "wordpress-seo" ),
				__( "PDF", "wordpress-seo" ),
				__( "File", "wordpress-seo" ),
			],
		},
		"metadesc-attachment": {
			route: "/settings/media-pages",
			routeLabel: __( "Media pages", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-metadesc-attachment",
			fieldLabel: __( "Meta description", "wordpress-seo" ),
			keywords: [
				__( "Image", "wordpress-seo" ),
				__( "Video", "wordpress-seo" ),
				__( "PDF", "wordpress-seo" ),
				__( "File", "wordpress-seo" ),
			],
		},
		"schema-page-type-attachment": {
			route: "/settings/media-pages",
			routeLabel: __( "Media pages", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-schema-page-type-attachment",
			fieldLabel: __( "Page type", "wordpress-seo" ),
			keywords: [
				__( "Schema", "wordpress-seo" ),
				__( "Structured data", "wordpress-seo" ),
				__( "Image", "wordpress-seo" ),
				__( "Video", "wordpress-seo" ),
				__( "PDF", "wordpress-seo" ),
				__( "File", "wordpress-seo" ),
			],
		},
		"schema-article-type-attachment": {
			route: "/settings/media-pages",
			routeLabel: __( "Media pages", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-schema-article-type-attachment",
			fieldLabel: __( "Article type", "wordpress-seo" ),
			keywords: [
				__( "Schema", "wordpress-seo" ),
				__( "Structured data", "wordpress-seo" ),
				__( "Image", "wordpress-seo" ),
				__( "Video", "wordpress-seo" ),
				__( "PDF", "wordpress-seo" ),
				__( "File", "wordpress-seo" ),
			],
		},
		"display-metabox-pt-attachment": {
			route: "/settings/media-pages",
			routeLabel: __( "Media pages", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-display-metabox-pt-attachment",
			fieldLabel: __( "Enable SEO controls and assessments", "wordpress-seo" ),
			keywords: [
				__( "Image", "wordpress-seo" ),
				__( "Video", "wordpress-seo" ),
				__( "PDF", "wordpress-seo" ),
				__( "File", "wordpress-seo" ),
			],
		},
		// Format archives
		"disable-post_format": {
			route: "/settings/format-archives",
			routeLabel: __( "Format archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-disable-post_format",
			fieldLabel: __( "Enable format-based archives", "wordpress-seo" ),
			keywords: [],
		},
		"noindex-tax-post_format": {
			route: "/settings/format-archives",
			routeLabel: __( "Format archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-noindex-tax-post_format",
			fieldLabel: __( "Show format archives in search results", "wordpress-seo" ),
			keywords: [],
		},
		"title-tax-post_format": {
			route: "/settings/format-archives",
			routeLabel: __( "Format archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-title-tax-post_format",
			fieldLabel: __( "SEO title", "wordpress-seo" ),
			keywords: [],
		},
		"metadesc-tax-post_format": {
			route: "/settings/format-archives",
			routeLabel: __( "Format archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-metadesc-tax-post_format",
			fieldLabel: __( "Meta description", "wordpress-seo" ),
			keywords: [],
		},
		"social-image-id-tax-post_format": {
			route: "/settings/format-archives",
			routeLabel: __( "Format archives", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-social-image-tax-post_format-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
			keywords: [],
		},
		"social-title-tax-post_format": {
			route: "/settings/format-archives",
			routeLabel: __( "Format archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-social-title-tax-post_format",
			fieldLabel: __( "Social title", "wordpress-seo" ),
			keywords: [],
		},
		"social-description-tax-post_format": {
			route: "/settings/format-archives",
			routeLabel: __( "Format archives", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-social-description-tax-post_format",
			fieldLabel: __( "Social description", "wordpress-seo" ),
			keywords: [],
		},
		// RSS
		rssbefore: {
			route: "/settings/rss",
			routeLabel: "RSS",
			fieldId: "input-wpseo_titles-rssbefore",
			fieldLabel: __( "Content to put before each post in the feed", "wordpress-seo" ),
			keywords: [],
		},
		rssafter: {
			route: "/settings/rss",
			routeLabel: "RSS",
			fieldId: "input-wpseo_titles-rssafter",
			fieldLabel: __( "Content to put after each post in the feed", "wordpress-seo" ),
			keywords: [],
		},
		// Post types - Attachments are handled separately above.
		...reduce( omit( postTypes, [ "attachment" ] ), ( acc, postType ) => ( {
			...acc,
			...createPostTypeSearchIndex( postType, { userLocale } ),
		} ), {} ),
		// Taxonomies
		...reduce( omit( taxonomies, [ "post_format" ] ), ( acc, taxonomy ) => ( {
			...acc,
			...createTaxonomySearchIndex( taxonomy, { userLocale } ),
		} ), {} ),
	},
	wpseo_social: {
		opengraph: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo_social-opengraph",
			fieldLabel: __( "Open Graph data", "wordpress-seo" ),
			keywords: [
				__( "Social", "wordpress-seo" ),
				__( "OpenGraph", "wordpress-seo" ),
				__( "Facebook", "wordpress-seo" ),
				__( "Share", "wordpress-seo" ),
			],
		},
		twitter: {
			route: "/settings/site-features",
			routeLabel: __( "Site features", "wordpress-seo" ),
			fieldId: "card-wpseo_social-twitter",
			fieldLabel: __( "Twitter card data", "wordpress-seo" ),
			keywords: [
				__( "Social", "wordpress-seo" ),
				__( "Share", "wordpress-seo" ),
				__( "Tweet", "wordpress-seo" ),
			],
		},
		og_default_image_id: {
			route: "/settings/site-basics",
			routeLabel: __( "Site basics", "wordpress-seo" ),
			fieldId: "button-wpseo_social-og_default_image-preview",
			fieldLabel: __( "Site image", "wordpress-seo" ),
			keywords: [],
		},
		pinterestverify: {
			route: "/settings/site-connections",
			routeLabel: __( "Site connections", "wordpress-seo" ),
			fieldId: "input-wpseo_social-pinterestverify",
			fieldLabel: __( "Pinterest", "wordpress-seo" ),
			keywords: [
				__( "Webmaster", "wordpress-seo" ),
			],
		},
		facebook_site: {
			route: "/settings/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_social-facebook_site",
			fieldLabel: __( "Organization Facebook", "wordpress-seo" ),
			keywords: [
				__( "Social", "wordpress-seo" ),
				__( "Open Graph", "wordpress-seo" ),
				__( "OpenGraph", "wordpress-seo" ),
				__( "Share", "wordpress-seo" ),
			],
		},
		twitter_site: {
			route: "/settings/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_social-twitter_site",
			fieldLabel: __( "Organization Twitter", "wordpress-seo" ),
			keywords: [
				__( "Social", "wordpress-seo" ),
				__( "Share", "wordpress-seo" ),
				__( "Tweet", "wordpress-seo" ),
			],
		},
		mastodon_url: {
			route: "/settings/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_social-mastodon_url",
			fieldLabel: __( "Organization Mastodon", "wordpress-seo" ),
			keywords: [
				__( "Social", "wordpress-seo" ),
				__( "Share", "wordpress-seo" ),
			],
		},
		other_social_urls: {
			route: "/settings/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "fieldset-wpseo_social-other_social_urls",
			fieldLabel: __( "Other social profiles", "wordpress-seo" ),
			keywords: [],
			// Add 25 dummy other social URL search entries for when users add them.
			...times( 25, index => ( {
				route: "/settings/site-representation",
				routeLabel: __( "Site representation", "wordpress-seo" ),
				fieldId: `input-wpseo_social-other_social_urls-${ index }`,
				// translators: %1$s exapnds to array index + 1.
				fieldLabel: sprintf( __( "Other profile %1$s", "wordpress-seo" ), index + 1 ),
			} ) ),
		},
	},
} );

/* eslint-disable camelcase */
import { __, sprintf } from "@wordpress/i18n";
import { reduce, times } from "lodash";

/**
 * @param {Object} postType The post type.
 * @returns {Object} The search index for the post type.
 */
export const createPostTypeSearchIndex = ( { name, label, route, hasArchive } ) => ( {
	[ `title-${ name }` ]: {
		route: `/post-type/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-title-${ name }`,
		fieldLabel: __( "SEO title", "wordpress-seo" ),
	},
	[ `metadesc-${ name }` ]: {
		route: `/post-type/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-metadesc-${ name }`,
		fieldLabel: __( "Meta description", "wordpress-seo" ),
	},
	[ `noindex-${ name }` ]: {
		route: `/post-type/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-noindex-${ name }`,
		fieldLabel: sprintf(
			// translators: %1$s expands to the post type plural, e.g. Posts.
			__( "Show %1$s in search results", "wordpress-seo" ),
			label
		),
	},
	[ `display-metabox-pt-${ name }` ]: {
		route: `/post-type/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-display-metabox-pt-${ name }`,
		fieldLabel: sprintf(
			/* translators: %1$s expands to Yoast SEO. %2$s expands to the post type plural, e.g. Posts. */
			__( "Enable %1$s for %2$s", "wordpress-seo" ),
			"Yoast SEO",
			label
		),
	},
	[ `schema-page-type-${ name }` ]: {
		route: `/post-type/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-schema-page-type-${ name }`,
		fieldLabel: __( "Page type", "wordpress-seo" ),
	},
	[ `schema-article-type-${ name }` ]: {
		route: `/post-type/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-schema-article-type-${ name }`,
		fieldLabel: __( "Article type", "wordpress-seo" ),
	},
	...( name !== "attachment" && {
		[ `social-title-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `field-wpseo_titles-social-title-${ name }`,
			fieldLabel: __( "Social title", "wordpress-seo" ),
		},
		[ `social-description-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `field-wpseo_titles-social-description-${ name }`,
			fieldLabel: __( "Social description", "wordpress-seo" ),
		},
		[ `social-image-url-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `button-wpseo_titles-social-image-${ name }-preview`,
			fieldLabel: __( "Social image", "wordpress-seo" ),
		},
		[ `social-image-id-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `button-wpseo_titles-social-image-${ name }-preview`,
			fieldLabel: __( "Social image", "wordpress-seo" ),
		},
	} ),
	...( hasArchive && {
		[ `title-ptarchive-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `field-wpseo_titles-title-ptarchive-${ name }`,
			fieldLabel: __( "Archive SEO title", "wordpress-seo" ),
		},
		[ `metadesc-ptarchive-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `field-wpseo_titles-metadesc-ptarchive-${ name }`,
			fieldLabel: __( "Archive meta description", "wordpress-seo" ),
		},
		[ `bctitle-ptarchive-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `field-wpseo_titles-bctitle-ptarchive-${ name }`,
			fieldLabel: __( "Archive breadcrumbs title", "wordpress-seo" ),
		},
		[ `noindex-ptarchive-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `field-wpseo_titles-noindex-ptarchive-${ name }`,
			fieldLabel: sprintf(
				// translators: %1$s expands to the post type plural, e.g. Posts.
				__( "Show the archive for %1$s in search results", "wordpress-seo" ),
				label
			),
		},
		[ `social-title-ptarchive-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `field-wpseo_titles-social-title-ptarchive-${ name }`,
			fieldLabel: __( "Archive social title", "wordpress-seo" ),
		},
		[ `social-description-ptarchive-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `field-wpseo_titles-social-description-ptarchive-${ name }`,
			fieldLabel: __( "Archive social description", "wordpress-seo" ),
		},
		[ `social-image-url-ptarchive-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `button-wpseo_titles-social-image-ptarchive-${ name }-preview`,
			fieldLabel: __( "Archive social image", "wordpress-seo" ),
		},
		[ `social-image-id-ptarchive-${ name }` ]: {
			route: `/post-type/${ route }`,
			routeLabel: label,
			fieldId: `button-wpseo_titles-social-image-ptarchive-${ name }-preview`,
			fieldLabel: __( "Archive social image", "wordpress-seo" ),
		},
	} ),
} );

/**
 * @param {Object} taxonomy The taxonomy.
 * @returns {Object} The search index for the taxonomy.
 */
export const createTaxonomySearchIndex = ( { name, label, route } ) => ( {
	[ `title-tax-${ name }` ]: {
		route: `/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-title-tax-${ name }`,
		fieldLabel: __( "SEO title", "wordpress-seo" ),
	},
	[ `metadesc-tax-${ name }` ]: {
		route: `/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-metadesc-tax-${ name }`,
		fieldLabel: __( "Meta description", "wordpress-seo" ),
	},
	[ `display-metabox-tax-${ name }` ]: {
		route: `/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-display-metabox-tax-${ name }`,
		fieldLabel: sprintf(
			/* translators: %1$s expands to Yoast SEO. %2$s expands to the taxonomy plural, e.g. Categories. */
			__( "Enable %1$s for %2$s", "wordpress-seo" ),
			"Yoast SEO",
			label
		),
	},
	[ `display-metabox-tax-${ name }` ]: {
		route: `/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-display-metabox-tax-${ name }`,
		fieldLabel: sprintf(
			/* translators: %1$s expands to Yoast SEO. %2$s expands to the taxonomy plural, e.g. Categories. */
			__( "Enable %1$s for %2$s", "wordpress-seo" ),
			"Yoast SEO",
			label
		),
	},
	[ `noindex-tax-${ name }` ]: {
		route: `/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-noindex-tax-${ name }`,
		fieldLabel: sprintf(
			// translators: %1$s expands to the taxonomy plural, e.g. Categories.
			__( "Show %1$s in search results", "wordpress-seo" ),
			label
		),
	},
	[ `social-title-tax-${ name }` ]: {
		route: `/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-social-title-tax-${ name }`,
		fieldLabel: __( "Social title", "wordpress-seo" ),
	},
	[ `social-description-tax-${ name }` ]: {
		route: `/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `field-wpseo_titles-social-description-tax-${ name }`,
		fieldLabel: __( "Social description", "wordpress-seo" ),
	},
	[ `social-image-url-tax-${ name }` ]: {
		route: `/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `button-wpseo_titles-social-image-tax-${ name }-preview`,
		fieldLabel: __( "Social image", "wordpress-seo" ),
	},
	[ `social-image-id-tax-${ name }` ]: {
		route: `/taxonomy/${ route }`,
		routeLabel: label,
		fieldId: `button-wpseo_titles-social-image-tax-${ name }-preview`,
		fieldLabel: __( "Social image", "wordpress-seo" ),
	},
} );

/**
 * @param {Object} postTypes The post types.
 * @param {Object} taxonomies The taxonomies.
 * @returns {Object} The search index.
 */
export const createSearchIndex = ( postTypes, taxonomies ) => ( {
	blogname: {
		route: "/site-basics",
		routeLabel: __( "Site basics", "wordpress-seo" ),
		fieldId: "input-blogname",
		fieldLabel: __( "Site title", "wordpress-seo" ),
	},
	blogdescription: {
		route: "/site-basics",
		routeLabel: __( "Site basics", "wordpress-seo" ),
		fieldId: "input-blogdescription",
		fieldLabel: __( "Tagline", "wordpress-seo" ),
	},
	wpseo: {
		keyword_analysis_active: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-keyword_analysis_active",
			fieldLabel: __( "SEO analysis", "wordpress-seo" ),
		},
		content_analysis_active: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-content_analysis_active",
			fieldLabel: __( "Readability analysis", "wordpress-seo" ),
		},
		inclusive_language_analysis_active: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-inclusive_language_analysis_active",
			fieldLabel: __( "Inclusive language analysis", "wordpress-seo" ),
		},
		enable_metabox_insights: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_metabox_insights",
			fieldLabel: __( "Insights", "wordpress-seo" ),
		},
		enable_cornerstone_content: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_cornerstone_content",
			fieldLabel: __( "Cornerstone content", "wordpress-seo" ),
		},
		enable_text_link_counter: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_text_link_counter",
			fieldLabel: __( "Text link counter", "wordpress-seo" ),
		},
		enable_link_suggestions: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_link_suggestions",
			fieldLabel: __( "Link suggestions", "wordpress-seo" ),
		},
		enable_enhanced_slack_sharing: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_enhanced_slack_sharing",
			fieldLabel: __( "Slack sharing", "wordpress-seo" ),
		},
		enable_admin_bar_menu: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_admin_bar_menu",
			fieldLabel: __( "Admin bar menu", "wordpress-seo" ),
		},
		enable_headless_rest_endpoints: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_headless_rest_endpoints",
			fieldLabel: __( "REST API endpoint", "wordpress-seo" ),
		},
		enable_xml_sitemap: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_xml_sitemap",
			fieldLabel: __( "XML sitemaps", "wordpress-seo" ),
		},
		enable_index_now: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo-enable_index_now",
			fieldLabel: __( "IndexNow", "wordpress-seo" ),
		},
		disableadvanced_meta: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "input-wpseo-disableadvanced_meta",
			fieldLabel: __( "Restrict advanced settings for authors", "wordpress-seo" ),
		},
		tracking: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "input-wpseo-tracking",
			fieldLabel: __( "Usage tracking", "wordpress-seo" ),
		},
		baiduverify: {
			route: "/webmaster-tools",
			routeLabel: __( "Webmaster tools", "wordpress-seo" ),
			fieldId: "input-wpseo-baiduverify",
			fieldLabel: __( "Baidu", "wordpress-seo" ),
		},
		googleverify: {
			route: "/webmaster-tools",
			routeLabel: __( "Webmaster tools", "wordpress-seo" ),
			fieldId: "input-wpseo-googleverify",
			fieldLabel: __( "Google", "wordpress-seo" ),
		},
		msverify: {
			route: "/webmaster-tools",
			routeLabel: __( "Webmaster tools", "wordpress-seo" ),
			fieldId: "input-wpseo-msverify",
			fieldLabel: __( "Bing", "wordpress-seo" ),
		},
		yandexverify: {
			route: "/webmaster-tools",
			routeLabel: __( "Webmaster tools", "wordpress-seo" ),
			fieldId: "input-wpseo-yandexverify",
			fieldLabel: __( "Yandex", "wordpress-seo" ),
		},
	},
	wpseo_titles: {
		separator: {
			route: "/site-basics",
			routeLabel: __( "Site basics", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-separator-sc-dash",
			fieldLabel: __( "Title separator", "wordpress-seo" ),
		},
		company_or_person: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-company_or_person-company",
			fieldLabel: __( "Organization or a person", "wordpress-seo" ),
		},
		company_name: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-company_name",
			fieldLabel: __( "Organization name", "wordpress-seo" ),
		},
		company_logo_id: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-company_logo-preview",
			fieldLabel: __( "Organization logo", "wordpress-seo" ),
		},
		company_or_person_user_id: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_titles-company_or_person_user_id",
			fieldLabel: __( "User", "wordpress-seo" ),
		},
		person_logo_id: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-person_logo-preview",
			fieldLabel: __( "Personal logo or avatar", "wordpress-seo" ),
		},
		open_graph_frontpage_image_id: {
			route: "/homepage",
			routeLabel: __( "Homepage", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-open_graph_frontpage_image-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
		},
		open_graph_frontpage_image: {
			route: "/homepage",
			routeLabel: __( "Homepage", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-open_graph_frontpage_image-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
		},
		...reduce( postTypes, ( acc, postType ) => ( {
			...acc,
			...createPostTypeSearchIndex( postType ),
		} ), {} ),
		...reduce( taxonomies, ( acc, taxonomy ) => ( {
			...acc,
			...createTaxonomySearchIndex( taxonomy ),
		} ), {} ),
		"social-image-id-author-wpseo": {
			route: "/author-archives",
			routeLabel: __( "Author archives", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-social-image-author-wpseo-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
		},
		"social-image-url-author-wpseo": {
			route: "/author-archives",
			routeLabel: __( "Author archives", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-social-image-author-wpseo-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
		},
		"social-image-id-archive-wpseo": {
			route: "/date-archives",
			routeLabel: __( "Date archives", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-social-image-archive-wpseo-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
		},
		"social-image-url-archive-wpseo": {
			route: "/date-archives",
			routeLabel: __( "Date archives", "wordpress-seo" ),
			fieldId: "button-wpseo_titles-social-image-archive-wpseo-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
		},
		"social-image-id-tax-post_format": {
			route: "/formats",
			routeLabel: taxonomies.post_format.label,
			fieldId: "button-wpseo_titles-social-image-tax-post_format-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
		},
		"social-image-url-tax-post_format": {
			route: "/formats",
			routeLabel: taxonomies.post_format.label,
			fieldId: "button-wpseo_titles-social-image-tax-post_format-preview",
			fieldLabel: __( "Social image", "wordpress-seo" ),
		},
	},
	wpseo_social: {
		opengraph: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo_social-opengraph",
			fieldLabel: __( "Open Graph data", "wordpress-seo" ),
		},
		twitter: {
			route: "/site-preferences",
			routeLabel: __( "Site preferences", "wordpress-seo" ),
			fieldId: "card-wpseo_social-twitter",
			fieldLabel: __( "Twitter card data", "wordpress-seo" ),
		},
		og_default_image_id: {
			route: "/site-basics",
			routeLabel: __( "Site basics", "wordpress-seo" ),
			fieldId: "button-wpseo_social-og_default_image-preview",
			fieldLabel: __( "Site image", "wordpress-seo" ),
		},
		og_default_image: {
			route: "/site-basics",
			routeLabel: __( "Site basics", "wordpress-seo" ),
			fieldId: "button-wpseo_social-og_default_image-preview",
			fieldLabel: __( "Site image", "wordpress-seo" ),
		},
		pinterestverify: {
			route: "/webmaster-tools",
			routeLabel: __( "Webmaster tools", "wordpress-seo" ),
			fieldId: "input-wpseo_social-pinterestverify",
			fieldLabel: __( "Pinterest", "wordpress-seo" ),
		},
		facebook_site: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_social-facebook_site",
			fieldLabel: __( "Facebook", "wordpress-seo" ),
		},
		twitter_site: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-wpseo_social-twitter_site",
			fieldLabel: __( "Twitter", "wordpress-seo" ),
		},
		other_social_urls: times( 25, index => ( {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: `input-wpseo_social-other_social_urls-${ index }`,
			fieldLabel: __( "Other social profile", "wordpress-seo" ),
		} ) ),
	},
	person_social_profiles: {
		facebook: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-person_social_profiles-facebook",
			fieldLabel: __( "Facebook", "wordpress-seo" ),
		},
		instagram: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-person_social_profiles-instagram",
			fieldLabel: __( "Instagram", "wordpress-seo" ),
		},
		linkedin: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-person_social_profiles-linkedin",
			fieldLabel: __( "LinkedIn", "wordpress-seo" ),
		},
		myspace: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-person_social_profiles-myspace",
			fieldLabel: __( "MySpace", "wordpress-seo" ),
		},
		pinterest: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-person_social_profiles-pinterest",
			fieldLabel: __( "Pinterest", "wordpress-seo" ),
		},
		soundcloud: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-person_social_profiles-soundcloud",
			fieldLabel: __( "SoundCloud", "wordpress-seo" ),
		},
		tumblr: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-person_social_profiles-tumblr",
			fieldLabel: __( "Tumblr", "wordpress-seo" ),
		},
		twitter: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-person_social_profiles-twitter",
			fieldLabel: __( "Twitter", "wordpress-seo" ),
		},
		youtube: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-person_social_profiles-youtube",
			fieldLabel: __( "YouTube", "wordpress-seo" ),
		},
		wikipedia: {
			route: "/site-representation",
			routeLabel: __( "Site representation", "wordpress-seo" ),
			fieldId: "input-person_social_profiles-wikipedia",
			fieldLabel: __( "Wikipedia", "wordpress-seo" ),
		},
	},
} );

import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Badge, Code, TextField, ToggleField } from "@yoast/ui-library";
import { Field, useFormikContext } from "formik";
import { addLinkToString } from "../../helpers/stringHelpers";
import { FieldsetLayout, FormikFlippedToggleField, FormikValueChangeField, FormLayout } from "../components";
import FormikTagField from "../components/formik-tag-field";
import { useSelectSettings } from "../store";

/**
 * @returns {JSX.Element} The crawl optimization route.
 */
const CrawlOptimization = () => {
	const crawlSettingsLink = useSelectSettings( "selectLink", [], "https://yoa.st/crawl-settings" );
	const permalinkCleanupLink = useSelectSettings( "selectLink", [], "https://yoa.st/permalink-cleanup" );

	const codeExample = useMemo( () => sprintf(
		/* translators: %1$s expands to an example within a code tag. */
		__( "E.g., %1$s", "wordpress-seo" ),
		"<code/>"
	), [] );
	const codeExamples = useMemo( () => sprintf(
		/* translators: %1$s and %2$s both expand to an example within a code tag. */
		__( "E.g., %1$s and %2$s", "wordpress-seo" )
		,
		"<code1/>",
		"<code2/>"
	), [] );
	const descriptions = useMemo( () => ( {
		page: addLinkToString(
			sprintf(
				/* translators: %1$s and %2$s are replaced by opening and closing <a> tags. */
				__( "Make your site more efficient and more environmentally friendly by preventing search engines from crawling things they don’t need to, and by removing unused WordPress features. %1$sLearn more about crawl settings and how they could benefit your site%2$s.", "wordpress-seo" ),
				"<a>",
				"</a>"
			),
			crawlSettingsLink,
			"link-crawl-settings-info"
		),

		// Remove unwanted metadata.
		removeUnwantedMetadata: createInterpolateElement(
			sprintf(
				/* translators: %1$s expands to `<head>` within a <code> tag. */
				__( "WordPress adds a lot of links and content to your site's %1$s and HTTP headers. Most people can safely disable all of these, which can help to save bytes, electricity, and trees.", "wordpress-seo" ),
				"<code/>"
			),
			{
				code: <Code>{ "<head>" }</Code>,
			}
		),
		removeShortlinks: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"shortlink\" href=\"https://www.example.com/?p=1\" />" }
			</Code>,
		} ),
		removeRestApiLinks: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"https://api.w.org/\" href=\"https://www.example.com/wp-json/\" />" }
			</Code>,
		} ),
		removeRsdWlwLinks: createInterpolateElement( codeExamples, {
			code1: <Code variant="block">
				{ "<link rel=\"EditURI\" type=\"application/rsd+xml\" title=\"RSD\" href=\"https://www.example.com/xmlrpc.php?rsd\" />" }
			</Code>,
			code2: <Code variant="block">
				{ "<link rel=\"wlwmanifest\" type=\"application/wlwmanifest+xml\" href=\"https://www.example.com/wp-includes/wlwmanifest.xml\" />" }
			</Code>,
		} ),
		removeOembedLinks: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/json+oembed\" href=\"https://www.example.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.example.com%2Fexample-post%2F\" />" }
			</Code>,
		} ),
		removeGenerator: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<meta name=\"generator\" content=\"WordPress 6.0.1\" />" }
			</Code>,
		} ),
		removePingbackHeader: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "X-Pingback: https://www.example.com/xmlrpc.php" }
			</Code>,
		} ),
		removePoweredByHeader: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "X-Powered-By: PHP/7.4.1" }
			</Code>,
		} ),

		// Disable unwanted content formats.
		removeFeedGlobal: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"Example Website - Feed\" href=\"https://www.example.com/feed/\" />" }
			</Code>,
		} ),
		removeFeedGlobalComments: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"Example Website - Comments Feed\" href=\"https://www.example.com/comments/feed/\" />" }
			</Code>,
		} ),
		removeFeedPostComments: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"Example Website - Example post Comments Feed\" href=\"https://www.example.com/example-post/feed/\" />" }
			</Code>,
		} ),
		removeFeedAuthors: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"Example Website - Posts by Example Author Feed\" href=\"https://www.example.com/author/example-author/feed/\" />" }
			</Code>,
		} ),
		removeFeedPostTypes: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"Example Website - Movies Feed\" href=\"https://www.example.com/movies/feed/\" />" }
			</Code>,
		} ),
		removeFeedCategories: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"Example Website - News Category Feed\" href=\"https://www.example.com/category/news/feed/\" />" }
			</Code>,
		} ),
		removeFeedTags: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"Example Website - Blue Tag Feed\" href=\"https://www.example.com/tag/blue/feed/\" />" }
			</Code>,
		} ),
		removeFeedCustomTaxonomies: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"Example Website - Large size Feed\" href=\"https://www.example.com/size/large/feed/\" />" }
			</Code>,
		} ),
		removeFeedSearch: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"Example Website - Search Results for 'example' Feed\" href=\"https://www.example.com/search/example/feed/rss2/\" />" }
			</Code>,
		} ),
		removeAtomRdfFeeds: createInterpolateElement( codeExample, {
			code: <Code variant="block">
				{ "<link rel=\"alternate\" type=\"application/rss+xml\" title=\"Example Website - Feed\" href=\"https://www.example.com/feed/atom/\" />" }
			</Code>,
		} ),

		// Remove unused resources.
		denyWpJsonCrawling: createInterpolateElement( codeExamples, {
			code1: <Code variant="block">
				{ "https://www.example.com/wp-json/" }
			</Code>,
			code2: <Code variant="block">
				{ "https://www.example.com/?rest_route=/" }
			</Code>,
		} ),

		// Internal site search cleanup.
		denySearchCrawling: createInterpolateElement(
			sprintf(
				/* translators: %1$s and %2$s expand to example parts of a URL, surrounded by <code> tags. */
				__( "Add a ‘disallow’ rule to your robots.txt file to prevent crawling of %1$s and %2$s URLs.", "wordpress-seo" ),
				"<code1/>",
				"<code2/>"
			),
			{
				code1: <Code>?s=</Code>,
				code2: <Code>/search/</Code>,
			}
		),

		// Advanced: URL cleanup.
		advancedUrlCleanup: createInterpolateElement(
			sprintf(
				/* translators: %1$s expands to an example part of a URL, surrounded by a <code> tag. */
				__( "Users and search engines may often request your URLs whilst using query parameters, like %1$s. These can be helpful for tracking, filtering, and powering advanced functionality - but they come with a performance and SEO ‘cost’. Sites which don’t rely on URL parameters might benefit from using these options.", "wordpress-seo" ),
				"<code/>"
			),
			{
				code: <Code>?color=red</Code>,
			}
		),
		cleanCampaignTrackingUrls: createInterpolateElement(
			sprintf(
				/**
				 * translators:
				 * %1$s expands to `<code>utm</code>`.
				 * %2$s expands to `<code>#</code>`.
				 * %3$s expands to `<code>301</code>`.
				 * %4$s and %5$s both expand to an example within a <code> tag.
				 */
				__( "Replaces %1$s tracking parameters with the (more performant) %2$s equivalent, via a %3$s redirect. E.g., %4$s will be redirected to %5$s", "wordpress-seo" ),
				"<code1/>",
				"<code2/>",
				"<code3/>",
				"<code4/>",
				"<code5/>"
			),
			{
				code1: <Code>utm</Code>,
				code2: <Code>#</Code>,
				code3: <Code>301</Code>,
				code4: <Code variant="block">https://www.example.com/?utm_medium=organic</Code>,
				code5: <Code variant="block">https://www.example.com/#utm_medium=organic</Code>,
			}
		),
		cleanPermalinks: createInterpolateElement(
			sprintf(
				/**
				 * translators:
				 * %1$s expands to `<code>301</code>`.
				 * %2$s and %3$s both expand to an example within a <code> tag.
				 */
				__( "Removes unknown URL parameters via a %1$s redirect. E.g., %2$s will be redirected to %3$s", "wordpress-seo" ),
				"<code1/>",
				"<code2/>",
				"<code3/>"
			),
			{
				code1: <Code>301</Code>,
				code2: <Code variant="block">https://www.example.com/?unknown_parameter=yes</Code>,
				code3: <Code variant="block">https://www.example.com</Code>,
			}
		),
		cleanPermalinksExtraVariables: createInterpolateElement(
			sprintf(
				/**
				 * translators:
				 * %1$s expands to `<code>unknown_parameter</code>`.
				 * %2$s and %3$s both expand to an example within a <code> tag.
				 */
				__( "Prevents specific URL parameters from being removed by the above feature. E.g., adding %1$s will prevent %2$s from being redirected to %3$s", "wordpress-seo" ),
				"<code1/>",
				"<code2/>",
				"<code3/>"
			),
			{
				code1: <Code>unknown_parameter</Code>,
				code2: <Code variant="block">https://www.example.com/?unknown_parameter=yes</Code>,
				code3: <Code variant="block">https://www.example.com</Code>,
			}
		),
	} ), [] );

	const { values } = useFormikContext();
	const {
		remove_feed_global_comments: removeFeedGlobalComments,
		remove_feed_post_comments: removeFeedPostComments,
		search_cleanup: searchCleanup,
		clean_permalinks: cleanPermalinks,
	} = values.wpseo;

	return (
		<FormLayout
			title={
				<span className="yst-inline-flex yst-items-center yst-gap-1.5">
					{ __( "Crawl optimization", "wordpress-seo" ) }
					<Badge variant="info">{ __( "Beta", "wordpress-seo" ) }</Badge>
				</span>
			}
			description={ descriptions.page }
		>
			<FieldsetLayout
				title={ __( "Remove unwanted metadata", "wordpress-seo" ) }
				description={ descriptions.removeUnwantedMetadata }
			>
				<FormikFlippedToggleField
					name="wpseo.remove_shortlinks"
					data-id="input-wpseo-remove_shortlinks"
					label={ __( "Shortlinks", "wordpress-seo" ) }
				>
					{ __( "Remove links to WordPress' internal 'shortlink' URLs for your posts.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeShortlinks }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_rest_api_links"
					data-id="input-wpseo-remove_rest_api_links"
					label={ __( "Rest API links", "wordpress-seo" ) }
				>
					{ __( "Remove links to the location of your site’s REST API endpoints.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeRestApiLinks }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_rsd_wlw_links"
					data-id="input-wpseo-remove_rsd_wlw_links"
					label={ __( "RSD / WLW links", "wordpress-seo" ) }
				>
					{ __( "Remove links used by external systems for publishing content to your blog.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeRsdWlwLinks }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_oembed_links"
					data-id="input-wpseo-remove_oembed_links"
					label={ __( "oEmbed links", "wordpress-seo" ) }
				>
					{ __( "Remove links used for embedding your content on other sites.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeOembedLinks }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_generator"
					data-id="input-wpseo-remove_generator"
					label={ __( "Generator tag", "wordpress-seo" ) }
				>
					{ __( "Remove information about the plugins and software used by your site.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeGenerator }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_pingback_header"
					data-id="input-wpseo-remove_pingback_header"
					label={ __( "Pingback HTTP header", "wordpress-seo" ) }
				>
					{ __( "Remove links which allow others sites to ‘ping’ yours when they link to you.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removePingbackHeader }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_powered_by_header"
					data-id="input-wpseo-remove_powered_by_header"
					label={ __( "Powered by HTTP header", "wordpress-seo" ) }
				>
					{ __( "Remove information about the plugins and software used by your site.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removePoweredByHeader }
				</FormikFlippedToggleField>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Disable unwanted content formats", "wordpress-seo" ) }
				description={ __( "WordPress outputs your content in many different formats, across many different URLs (like RSS feeds of your posts and categories). It’s generally good practice to disable the formats you’re not actively using.", "wordpress-seo" ) }
			>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_global"
					data-id="input-wpseo-remove_feed_global"
					label={ __( "Global feed", "wordpress-seo" ) }
				>
					{ __( "Remove URLs which provide an overview of your recent posts.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeFeedGlobal }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_global_comments"
					data-id="input-wpseo-remove_feed_global_comments"
					label={ __( "Global comment feeds", "wordpress-seo" ) }
				>
					{ __( "Remove URLs which provide an overview of recent comments on your site.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeFeedGlobalComments }
					{ __( "Also disables Post comment feeds.", "wordpress-seo" ) }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_post_comments"
					data-id="input-wpseo-remove_feed_post_comments"
					label={ __( "Post comments feeds", "wordpress-seo" ) }
					disabled={ removeFeedGlobalComments }
					checked={ removeFeedGlobalComments || removeFeedPostComments }
				>
					{ __( "Remove URLs which provide information about recent comments on each post.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeFeedPostComments }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_authors"
					data-id="input-wpseo-remove_feed_authors"
					label={ __( "Post authors feeds", "wordpress-seo" ) }
				>
					{ __( "Remove URLs which provide information about recent posts by specific authors.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeFeedAuthors }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_post_types"
					data-id="input-wpseo-remove_feed_post_types"
					label={ __( "Post type feeds", "wordpress-seo" ) }
				>
					{ __( "Remove URLs which provide information about your recent posts, for each post type.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeFeedPostTypes }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_categories"
					data-id="input-wpseo-remove_feed_categories"
					label={ __( "Category feeds", "wordpress-seo" ) }
				>
					{ __( "Remove URLs which provide information about your recent posts, for each category.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeFeedCategories }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_tags"
					data-id="input-wpseo-remove_feed_tags"
					label={ __( "Tag feeds", "wordpress-seo" ) }
				>
					{ __( "Remove URLs which provide information about your recent posts, for each tag.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeFeedTags }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_custom_taxonomies"
					data-id="input-wpseo-remove_feed_custom_taxonomies"
					label={ __( "Custom taxonomy feeds", "wordpress-seo" ) }
				>
					{ __( "Remove URLs which provide information about your recent posts, for each custom taxonomy.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeFeedCustomTaxonomies }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_search"
					data-id="input-wpseo-remove_feed_search"
					label={ __( "Search results feeds", "wordpress-seo" ) }
				>
					{ __( "Remove URLs which provide information about your search results.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeFeedSearch }
				</FormikFlippedToggleField>
				<FormikFlippedToggleField
					name="wpseo.remove_atom_rdf_feeds"
					data-id="input-wpseo-remove_atom_rdf_feeds"
					label={ __( "Atom/RDF feeds", "wordpress-seo" ) }
				>
					{ __( "Remove URLs which provide alternative (legacy) formats of all of the above.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.removeAtomRdfFeeds }
				</FormikFlippedToggleField>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Remove unused resources", "wordpress-seo" ) }
				description={ __( "WordPress loads lots of resources, some of which your site might not need. If you’re not using these, removing them can speed up your pages and save resources.", "wordpress-seo" ) }
			>
				<FormikFlippedToggleField
					name="wpseo.remove_emoji_scripts"
					data-id="input-wpseo-remove_emoji_scripts"
					label={ __( "Emoji scripts", "wordpress-seo" ) }
					description={ __( "Remove JavaScript used for converting emoji characters in older browsers.", "wordpress-seo" ) }
				/>
				<FormikFlippedToggleField
					name="wpseo.deny_wp_json_crawling"
					data-id="input-wpseo-deny_wp_json_crawling"
					label={ __( "WP-JSON API", "wordpress-seo" ) }
				>
					{ __( "Add a ‘disallow’ rule to your robots.txt file to prevent crawling of WordPress' JSON API endpoints.", "wordpress-seo" ) }
					&nbsp;
					{ descriptions.denyWpJsonCrawling }
				</FormikFlippedToggleField>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Internal site search cleanup", "wordpress-seo" ) }
				description={ __( "Your internal site search can create lots of confusing URLs for search engines, and can even be used as a way for SEO spammers to attack your site. Most sites will benefit from experimenting with these protections and optimizations, even if you don’t have a search feature in your theme.", "wordpress-seo" ) }
			>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.search_cleanup"
					data-id="input-wpseo-search_cleanup"
					label={ __( "Filter search terms", "wordpress-seo" ) }
					description={ __( "Enables advanced settings for protecting your internal site search URLs.", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo.search_character_limit"
					id="input-wpseo-search_character_limit"
					label={ __( "Max number of characters to allow in searches", "wordpress-seo" ) }
					description={ __( "Limit the length of internal site search queries to reduce the impact of spam attacks and confusing URLs.", "wordpress-seo" ) }
					disabled={ ! searchCleanup }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.search_cleanup_emoji"
					data-id="input-wpseo-search_cleanup_emoji"
					label={ __( "Filter searches with emojis and other special characters", "wordpress-seo" ) }
					description={ __( "Block internal site searches which contain complex and non-alphanumeric characters, as they may be part of a spam attack.", "wordpress-seo" ) }
					disabled={ ! searchCleanup }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.search_cleanup_patterns"
					data-id="input-wpseo-search_cleanup_patterns"
					label={ __( "Filter searches with common spam patterns", "wordpress-seo" ) }
					description={ __( "Block internal site searches which match the patterns of known spam attacks.", "wordpress-seo" ) }
					disabled={ ! searchCleanup }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.deny_search_crawling"
					data-id="input-wpseo-deny_search_crawling"
					label={ __( "Prevent crawling of internal site search URLs", "wordpress-seo" ) }
					description={ descriptions.denySearchCrawling }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Advanced: URL cleanup", "wordpress-seo" ) }
				description={ descriptions.advancedUrlCleanup }
			>
				<Alert id="alert-permalink-cleanup-settings" variant="warning">
					{ addLinkToString(
						sprintf(
							// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
							__( "These are expert features, so make sure you know what you're doing before removing the parameters. %1$sRead more about how your site can be affected%2$s.", "wordpress-seo" ),
							"<a>",
							"</a>"
						),
						permalinkCleanupLink,
						"link-permalink-cleanup-info"
					) }
				</Alert>
				<FormikFlippedToggleField
					name="wpseo.clean_campaign_tracking_urls"
					data-id="input-wpseo-clean_campaign_tracking_urls"
					label={ __( "Google Analytics utm tracking parameters", "wordpress-seo" ) }
					description={ descriptions.cleanCampaignTrackingUrls }
				/>
				<FormikFlippedToggleField
					name="wpseo.clean_permalinks"
					data-id="input-wpseo-clean_permalinks"
					label={ __( "Unregistered URL parameters", "wordpress-seo" ) }
					description={ descriptions.cleanPermalinks }
				/>
				<FormikTagField
					name="wpseo.clean_permalinks_extra_variables"
					id="input-wpseo-clean_permalinks_extra_variables"
					label={ __( "Additional URL parameters to allow", "wordpress-seo" ) }
					description={ descriptions.cleanPermalinksExtraVariables }
					disabled={ ! cleanPermalinks }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default CrawlOptimization;

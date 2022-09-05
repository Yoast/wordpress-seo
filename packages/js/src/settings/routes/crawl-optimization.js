import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Badge, Code, TextField, ToggleField } from "@yoast/ui-library";
import { Field, useFormikContext } from "formik";
import { addLinkToString } from "../../helpers/stringHelpers";
import { FieldsetLayout, FormikFlippedToggleField, FormikValueChangeField, FormLayout } from "../components";
import { useSelectSettings } from "../store";

/**
 * @returns {JSX.Element} The crawl optimization route.
 */
const CrawlOptimization = () => {
	const crawlSettingsLink = useSelectSettings( "selectLink", [], "https://yoa.st/crawl-settings" );
	const permalinkCleanupLink = useSelectSettings( "selectLink", [], "https://yoa.st/permalink-cleanup" );

	const description = useMemo( () => addLinkToString(
		sprintf(
			/* translators: %1$s and %2$s are replaced by opening and closing <a> tags. */
			__( "Make your site more efficient and more environmentally friendly by preventing search engines from crawling things they don’t need to, and by removing unused WordPress features. %1$sLearn more about crawl settings and how they could benefit your site%2$s.", "wordpress-seo" ),
			"<a>",
			"</a>"
		),
		crawlSettingsLink,
		"link-crawl-settings-info"
	), [] );
	const removeUnwantedMetadataDescription = useMemo( () => createInterpolateElement(
		sprintf(
			/* translators: %1$s expands to `<head>` within a code tag. */
			__( "WordPress adds a lot of links and content to your site's %1$s and HTTP headers. Most people can safely disable all of these, which can help to save bytes, electricity, and trees.", "wordpress-seo" ),
			"<code/>"
		),
		{
			code: <code className="yst-text-xs">{ "<head>" }</code>,
		}
	), [] );

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
		removeShortlinks: createInterpolateElement( codeExample, {
			code: <Code>{ "<link rel=\"shortlink\" href=\"https://www.example.com/?p=1\" />" }</Code>,
		} ),
		removeRestApiLinks: createInterpolateElement( codeExample, {
			code: <Code>{ "<link rel=\"https://api.w.org/\" href=\"https://www.example.com/wp-json/\" />" }</Code>,
		} ),
		removeRsdWlwLinks: createInterpolateElement( codeExamples, {
			code1: <Code>
				{ "<link rel=\"EditURI\" type=\"application/rsd+xml\" title=\"RSD\" href=\"https://www.example.com/xmlrpc.php?rsd\" />" }
			</Code>,
			code2: <Code>
				{ "<link rel=\"wlwmanifest\" type=\"application/wlwmanifest+xml\" href=\"https://www.example.com/wp-includes/wlwmanifest.xml\" />" }
			</Code>,
		} ),
		removeOembedLinks: createInterpolateElement( codeExample, {
			code: <Code>
				{ "<link rel=\"alternate\" type=\"application/json+oembed\" href=\"https://www.example.com/wp-json/oembed/1.0/embed?url=https%3A%2F%2Fwww.example.com%2Fexample-post%2F\" />" }
			</Code>,
		} ),
		removeGenerator: createInterpolateElement( codeExample, {
			code: <Code>{ "<meta name=\"generator\" content=\"WordPress 6.0.1\" />" }</Code>,
		} ),
		removePingbackHeader: createInterpolateElement( codeExample, {
			code: <Code>{ "X-Pingback: https://www.example.com/xmlrpc.php" }</Code>,
		} ),
		removePoweredByHeader: createInterpolateElement( codeExample, {
			code: <Code>{ "X-Powered-By: PHP/7.4.1" }</Code>,
		} ),
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
			description={ description }
		>
			<FieldsetLayout
				title={ __( "Remove unwanted metadata", "wordpress-seo" ) }
				description={ removeUnwantedMetadataDescription }
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
				title={ __( "Feed cleanup", "wordpress-seo" ) }
				description={ __( "Remove feed links added by WordPress that aren't needed for this site.", "wordpress-seo" ) }
			>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_global"
					data-id="input-wpseo-remove_feed_global"
					label={ __( "Global feed", "wordpress-seo" ) }
				/>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_global_comments"
					data-id="input-wpseo-remove_feed_global_comments"
					label={ __( "Global comment feeds", "wordpress-seo" ) }
					description={ __( "By disabling and removing Global comments feed, Post comments feeds will be disabled and removed too.", "wordpress-seo" ) }
				/>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_post_comments"
					data-id="input-wpseo-remove_feed_post_comments"
					label={ __( "Post comments feeds", "wordpress-seo" ) }
					disabled={ removeFeedGlobalComments }
					checked={ removeFeedGlobalComments || removeFeedPostComments }
				/>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_authors"
					data-id="input-wpseo-remove_feed_authors"
					label={ __( "Post authors feeds", "wordpress-seo" ) }
				/>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_post_types"
					data-id="input-wpseo-remove_feed_post_types"
					label={ __( "Post type feeds", "wordpress-seo" ) }
				/>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_categories"
					data-id="input-wpseo-remove_feed_categories"
					label={ __( "Category feeds", "wordpress-seo" ) }
				/>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_tags"
					data-id="input-wpseo-remove_feed_tags"
					label={ __( "Tag feeds", "wordpress-seo" ) }
				/>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_custom_taxonomies"
					data-id="input-wpseo-remove_feed_custom_taxonomies"
					label={ __( "Custom taxonomy feeds", "wordpress-seo" ) }
				/>
				<FormikFlippedToggleField
					name="wpseo.remove_feed_search"
					data-id="input-wpseo-remove_feed_search"
					label={ __( "Search results feeds", "wordpress-seo" ) }
				/>
				<FormikFlippedToggleField
					name="wpseo.remove_atom_rdf_feeds"
					data-id="input-wpseo-remove_atom_rdf_feeds"
					label={ __( "Atom/RDF feeds", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Unused resources", "wordpress-seo" ) }
				description={ __( "WordPress loads lots of resources, some of which your site might not need. If you’re not using these, removing them can speed up your pages and save resources.", "wordpress-seo" ) }
			>
				<FormikFlippedToggleField
					name="wpseo.remove_emoji_scripts"
					data-id="input-wpseo-remove_emoji_scripts"
					label={ __( "Emoji scripts", "wordpress-seo" ) }
					description={ __( "Remove JavaScript used for converting emoji characters in older browsers.", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Search cleanup", "wordpress-seo" ) }
				description={ __( "Enable settings to clean up and filter searches to prevent search spam.", "wordpress-seo" ) }
			>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.search_cleanup"
					data-id="input-wpseo-search_cleanup"
					label={ __( "Filter search terms", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.search_cleanup_emoji"
					data-id="input-wpseo-search_cleanup_emoji"
					label={ __( "Filter searches with emojis and other special characters", "wordpress-seo" ) }
					disabled={ ! searchCleanup }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.search_cleanup_patterns"
					data-id="input-wpseo-search_cleanup_patterns"
					label={ __( "Filters searches with common spam patterns", "wordpress-seo" ) }
					disabled={ ! searchCleanup }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Permalink cleanup", "wordpress-seo" ) }
				description={ __( "Disable settings to remove unwanted URL parameters from your URLs.", "wordpress-seo" ) }
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
					label={ __( "Campaign tracking URL parameters", "wordpress-seo" ) }
				/>
				<FormikFlippedToggleField
					name="wpseo.clean_permalinks"
					data-id="input-wpseo-clean_permalinks"
					label={ __( "Unregistered URL parameters", "wordpress-seo" ) }
				/>
				<Field
					as={ TextField }
					type="text"
					name="wpseo.clean_permalinks_extra_variables"
					id="input-wpseo-clean_permalinks_extra_variables"
					label={ __( "Additional URL parameters to allow", "wordpress-seo" ) }
					description={ __( "Please use a comma to separate multiple URL parameters.", "wordpress-seo" ) }
					disabled={ ! cleanPermalinks }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default CrawlOptimization;

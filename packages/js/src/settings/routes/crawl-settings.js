import { __, sprintf } from "@wordpress/i18n";
import { Alert, Title, ToggleField, TextField } from "@yoast/ui-library";
import { Field, useFormikContext } from "formik";
import { addLinkToString } from "../../helpers/stringHelpers";
import { FormikValueChangeField, FormLayout } from "../components";

/**
 * @returns {JSX.Element} The site preferences route.
 */
const CrawlSettings = () => {
	const { values } = useFormikContext();
	const {
		remove_feed_global_comments,
		remove_feed_post_comments,
		search_cleanup,
		clean_permalinks,
	} = values.wpseo;

	return (
		<FormLayout
			title={ __( "Crawl settings", "wordpress-seo" ) }
			description={ addLinkToString(
				sprintf(
					// translators: %1$s and %2$s are replaced by opening and closing <a> tags. %3$s expands to WordProof.
					__( "To make the crawling of your site more efficient and environmental friendly, Yoast SEO Premium allows you to remove URLs (added by WordPress) that might not be needed for your site. %1$sLearn more about crawl settings and how they could benefit your site%2$s.", "wordpress-seo" ),
					"<a>",
					"</a>"
				),
				"https://yoa.st/crawl-settings"
			) }
		>
			<fieldset className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
				<div className="lg:yst-col-span-1">
					<div className="max-w-screen-sm">
						<Title as="legend" size="4" className="yst-mb-2">
							{ __( "Basic crawl settings", "wordpress-seo" ) }
						</Title>
						<p>
							{ __( "Remove links added by WordPress to the header and <head>.", "wordpress-seo" ) }
						</p>
					</div>
				</div>
				<div className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_shortlinks"
						data-id="input:wpseo.remove_shortlinks"
						label={ __( "Shortlinks", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_rest_api_links"
						data-id="input:wpseo.remove_rest_api_links"
						label={ __( "Rest API links", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_rsd_wlw_links"
						data-id="input:wpseo.remove_rsd_wlw_links"
						label={ __( "RSD / WLW links", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_oembed_links"
						data-id="input:wpseo.remove_oembed_links"
						label={ __( "oEmbed links", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_generator"
						data-id="input:wpseo.remove_generator"
						label={ __( "Generator tag", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_emoji_scripts"
						data-id="input:wpseo.remove_emoji_scripts"
						label={ __( "Emoji scripts", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_pingback_header"
						data-id="input:wpseo.remove_pingback_header"
						label={ __( "Pingback HTTP header", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_powered_by_header"
						data-id="input:wpseo.remove_powered_by_header"
						label={ __( "Powered by HTTP header", "wordpress-seo" ) }
					/>
				</div>
			</fieldset>
			<hr className="yst-my-8" />
			<fieldset className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
				<div className="lg:yst-col-span-1">
					<div className="max-w-screen-sm">
						<Title as="legend" size="4" className="yst-mb-2">
							{ __( "Feed cleanup settings", "wordpress-seo" ) }
						</Title>
						<p>
							{ __( "Remove feed links added by WordPress that aren't needed for this site.", "wordpress-seo" ) }
						</p>
					</div>
				</div>
				<div className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_feed_global"
						data-id="input:wpseo.remove_feed_global"
						label={ __( "Global feed", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_feed_global_comments"
						data-id="input:wpseo.remove_feed_global_comments"
						label={ __( "Global comment feeds", "wordpress-seo" ) }
						description={ __( "By removing Global comments feed, Post comments feeds will be removed too.", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_feed_post_comments"
						data-id="input:wpseo.remove_feed_post_comments"
						label={ __( "Post comments feeds", "wordpress-seo" ) }
						disabled={ remove_feed_global_comments }
						checked={ remove_feed_global_comments || remove_feed_post_comments }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_feed_authors"
						data-id="input:wpseo.remove_feed_authors"
						label={ __( "Post authors feeds", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_feed_post_types"
						data-id="input:wpseo.remove_feed_post_types"
						label={ __( "Post type feeds", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_feed_categories"
						data-id="input:wpseo.remove_feed_categories"
						label={ __( "Category feeds", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_feed_tags"
						data-id="input:wpseo.remove_feed_tags"
						label={ __( "Tag feeds", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_feed_custom_taxonomies"
						data-id="input:wpseo.remove_feed_custom_taxonomies"
						label={ __( "Custom taxonomy feeds", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_feed_search"
						data-id="input:wpseo.remove_feed_search"
						label={ __( "Search results feeds", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.remove_atom_rdf_feeds"
						data-id="input:wpseo.remove_atom_rdf_feeds"
						label={ __( "Atom/RDF feeds", "wordpress-seo" ) }
					/>
				</div>
			</fieldset>
			<hr className="yst-my-8" />
			<fieldset className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
				<div className="lg:yst-col-span-1">
					<div className="max-w-screen-sm">
						<Title as="legend" size="4" className="yst-mb-2">
							{ __( "Search cleanup settings", "wordpress-seo" ) }
						</Title>
						<p>
							{ __( "Clean up and filter searches to prevent search spam.", "wordpress-seo" ) }
						</p>
					</div>
				</div>
				<div className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.search_cleanup"
						data-id="input:wpseo.search_cleanup"
						label={ __( "Filter search terms", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.search_cleanup_emoji"
						data-id="input:wpseo.search_cleanup_emoji"
						label={ __( "Filter searches with emojis and other special characters", "wordpress-seo" ) }
						disabled={ ! search_cleanup }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.search_cleanup_patterns"
						data-id="input:wpseo.search_cleanup_patterns"
						label={ __( "Filters searches with common spam patterns", "wordpress-seo" ) }
						disabled={ ! search_cleanup }
					/>
				</div>
			</fieldset>
			<hr className="yst-my-8" />
			<fieldset className="lg:yst-grid lg:yst-grid-cols-3 lg:yst-gap-12">
				<div className="lg:yst-col-span-1">
					<div className="max-w-screen-sm">
						<Title as="legend" size="4" className="yst-mb-2">
							{ __( "Permalink cleanup settings", "wordpress-seo" ) }
						</Title>
						<p>
							{ __( "Remove unwanted URL parameters from your URLs.", "wordpress-seo" ) }
						</p>
					</div>
				</div>
				<div className="yst-mt-8 lg:yst-mt-0 lg:yst-col-span-2 yst-space-y-8">
					<Alert id="id:permalink-cleanup-settings" variant="warning">
						{ addLinkToString(
							sprintf(
								// translators: %1$s and %2$s are replaced by opening and closing <a> tags. %3$s expands to WordProof.
								__( "These are expert features, so make sure you know what you're doing before removing the parameters. %1$sRead more about how your site can be affected%2$s.", "wordpress-seo" ),
								"<a>",
								"</a>"
							),
							"https://yoa.st/permalink-cleanup"
						) }
					</Alert>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.clean_campaign_tracking_urls"
						data-id="input:wpseo.clean_campaign_tracking_urls"
						label={ __( "Campaign tracking URL parameters", "wordpress-seo" ) }
					/>
					<FormikValueChangeField
						as={ ToggleField }
						type="checkbox"
						name="wpseo.clean_permalinks"
						data-id="input:wpseo.clean_permalinks"
						label={ __( "Unregistered URL parameters", "wordpress-seo" ) }
					/>
					<Field
						as={ TextField }
						type="text"
						name="wpseo.clean_permalinks_extra_variables"
						id="input:wpseo.clean_permalinks_extra_variables"
						label={ __( "Additional URL parameters to allow", "wordpress-seo" ) }
						disabled={ ! clean_permalinks }
					/>
				</div>
			</fieldset>
		</FormLayout>
	);
};

export default CrawlSettings;

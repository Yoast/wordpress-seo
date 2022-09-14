import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Badge, ToggleField as PureToggleField, Title, Card } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import { FieldsetLayout, FormikValueChangeField, FormLayout } from "../components";
import { withDisabledMessageSupport } from "../hocs";
import { useSelectSettings } from "../store";

const ToggleField = withDisabledMessageSupport( PureToggleField );

/**
 * @param {string} link The link/URL.
 * @param {string} content Expected to contain 2 replacements, indicating the start and end anchor tags.
 * @param {string} id The ID.
 * @param {Object} [anchorProps] Extra anchor properties.
 * @returns {JSX.Element} The anchor element.
 */
const useSelectLink = ( { link, content, id, ...anchorProps } ) => {
	const href = useSelectSettings( "selectLink", [ link ], link );
	return useMemo( () => createInterpolateElement(
		sprintf( content, "<a>", "</a>" ),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a
				id={ id }
				href={ href }
				target="_blank"
				rel="noopener noreferrer"
				{ ...anchorProps }
			/>,
		}
	), [ href, content, id, anchorProps ] );
};

/**
 * @returns {JSX.Element} The site preferences route.
 */
const SitePreferences = () => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const sitemapUrl = useSelectSettings( "selectPreference", [], "sitemapUrl" );
	const sitemapsLink = useSelectSettings( "selectLink", [], "https://yoa.st/2a-" );

	const { values } = useFormikContext();
	const { enable_xml_sitemap: enableXmlSitemap } = values.wpseo;

	const seoAnalysisLink = useSelectLink( {
		link: "https://yoa.st/2ak",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "The SEO analysis offers suggestions to improve the SEO of your text. %1$sLearn how the SEO analysis can help you rank%2$s.", "wordpress-seo" ),
		id: "link-seo-analysis",
	} );
	const readabilityAnalysisLink = useSelectLink( {
		link: "https://yoa.st/2ao",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "The readability analysis offers suggestions to improve the structure and style of your text. %1$sDiscover why readability is important for SEO%2$s.", "wordpress-seo" ),
		id: "link-readability-analysis",
	} );
	const insightsLink = useSelectLink( {
		link: "https://yoa.st/4ew",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "Find relevant data about your content right in the Insights section in the Yoast SEO metabox. You’ll see what words you use most often and if they’re a match with your keywords! %1$sFind out how Insights can help you improve your content%2$s.", "wordpress-seo" ),
		id: "link-insights",
	} );
	const cornerstoneContentLink = useSelectLink( {
		link: "https://yoa.st/dashboard-help-cornerstone",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "The cornerstone content feature lets you to mark and filter cornerstone content on your website. %1$sFind out how cornerstone content can help you improve your site structure%2$s.", "wordpress-seo" ),
		id: "link-cornerstone-content",
	} );
	const textLinkCounterLink = useSelectLink( {
		link: "https://yoa.st/2aj",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "The text link counter helps you improve your site structure. %1$sFind out how the text link counter can enhance your SEO%2$s.", "wordpress-seo" ),
		id: "link-text-link-counter",
	} );
	const linkSuggestionsLink = useSelectLink( {
		link: isPremium ? "https://yoa.st/17g" : "https://yoa.st/4ev",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "The link suggestions metabox contains a list of posts on your blog with similar content that might be interesting to link to. %1$sRead more about how internal linking can improve your site structure%2$s.", "wordpress-seo" ),
		id: "link-suggestions-link",
	} );
	const slackSharingLink = useSelectLink( {
		link: "https://yoa.st/help-slack-share",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "This adds an author byline and reading time estimate to the article’s snippet when shared on Slack. %1$sFind out how a rich snippet can improve visibility and click-through-rate%2$s.", "wordpress-seo" ),
		id: "link-slack-sharing",
	} );
	const xmlSitemapsLink = useMemo( () => createInterpolateElement(
		[
			__( "Enable the XML sitemaps that Yoast SEO generates.", "wordpress-seo" ),
			enableXmlSitemap ? sprintf(
				/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
				__( "%1$sSee the XML sitemap%2$s.", "wordpress-seo" ),
				"<sitemap>",
				"</sitemap>"
			) : false,
			sprintf(
				/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
				__( "%1$sRead why XML Sitemaps are important for your site%2$s.", "wordpress-seo" ),
				"<a>",
				"</a>"
			),
		].filter( Boolean ).join( " " ),
		{
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			a: <a
				id={ "link-xml-sitemaps" }
				href={ sitemapsLink }
				target="_blank"
				rel="noopener noreferrer"
			/>,
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			sitemap: <a
				id={ "link-xml-sitemaps" }
				href={ sitemapUrl }
				target="_blank" rel="noreferrer"
			/>,
		}
	), [ sitemapsLink, sitemapUrl, enableXmlSitemap ] );
	const usageTrackingLink = useSelectLink( {
		link: "https://yoa.st/usage-tracking-2",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "Usage tracking allows us to track some data about your site to improve our plugin. %1$sAllow us to track some data about your site to improve our plugin%2$s.", "wordpress-seo" ),
		id: "link-usage-tracking",
	} );
	const indexNowLink = useSelectLink( {
		link: "https://yoa.st/index-now-feature",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "Automatically ping search engines like Bing and Yandex whenever you publish, update or delete a post. %1$sFind out how IndexNow can help your site%2$s.", "wordpress-seo" ),
		id: "link-usage-tracking",
	} );
	const inclusiveLanguageAnalysisLink = useSelectLink( {
		link: "https://yoa.st/inclusive-language-analysis",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "The inclusive language analysis offers suggestions to write more inclusive copy. %1$sDiscover why inclusive language is important for SEO%2$s.", "wordpress-seo" ),
		id: "link-inclusive-language-analysis",
	} );

	return (
		<FormLayout
			title={ __( "Site preferences", "wordpress-seo" ) }
			description={ __( "Tell us which features you want to use.", "wordpress-seo" ) }
		>
			<fieldset className="yst-min-w-0">
				<div className="yst-max-w-screen-sm yst-mb-8">
					<Title as="legend" size="2">
						{ __( "Writing", "wordpress-seo" ) }
					</Title>
				</div>
				<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "SEO analysis", "wordpress-seo" ) }
							</Title>
						</Card.Header>
						<Card.Content>
							{ seoAnalysisLink }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.keyword_analysis_active"
								data-id="input-wpseo-keyword_analysis_active"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "Readability analysis", "wordpress-seo" ) }
							</Title>
						</Card.Header>
						<Card.Content>
							{ readabilityAnalysisLink }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.content_analysis_active"
								data-id="input-wpseo-content_analysis_active"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "Inclusive language analysis", "wordpress-seo" ) }
							</Title>
							<div className="yst-absolute yst-top-2 yst-right-2 yst-flex yst-gap-1.5">
								<Badge size="small" variant="upsell">Premium</Badge>
								<Badge size="small" variant="info">Beta</Badge>
							</div>
						</Card.Header>
						<Card.Content>
							{ inclusiveLanguageAnalysisLink }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.inclusive_language_analysis_active"
								data-id="input-wpseo-inclusive_language_analysis_active"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "Insights", "wordpress-seo" ) }
							</Title>
							<div className="yst-absolute yst-top-2 yst-right-2 yst-flex yst-gap-1.5">
								<Badge size="small" variant="upsell">Premium</Badge>
							</div>
						</Card.Header>
						<Card.Content>
							{ insightsLink }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_metabox_insights"
								data-id="input-wpseo-enable_metabox_insights"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
				</div>
			</fieldset>
			<hr className="yst-my-8" />
			<fieldset className="yst-min-w-0">
				<div className="yst-max-w-screen-sm yst-mb-8">
					<Title as="legend" size="2">
						{ __( "Site structure", "wordpress-seo" ) }
					</Title>
				</div>
				<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "Cornerstone content", "wordpress-seo" ) }
							</Title>
						</Card.Header>
						<Card.Content>
							{ cornerstoneContentLink }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_cornerstone_content"
								data-id="input-wpseo-enable_cornerstone_content"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "Text link counter", "wordpress-seo" ) }
							</Title>
						</Card.Header>
						<Card.Content>
							{ textLinkCounterLink }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_text_link_counter"
								data-id="input-wpseo-enable_text_link_counter"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "Link suggestions", "wordpress-seo" ) }
							</Title>
							<div className="yst-absolute yst-top-2 yst-right-2 yst-flex yst-gap-1.5">
								<Badge size="small" variant="upsell">Premium</Badge>
							</div>
						</Card.Header>
						<Card.Content>
							{ linkSuggestionsLink }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_link_suggestions"
								data-id="input-wpseo-enable_link_suggestions"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
				</div>
			</fieldset>
			<hr className="yst-my-8" />
			<fieldset id="section-social-sharing" className="yst-min-w-0">
				<div className="yst-max-w-screen-sm yst-mb-8">
					<Title as="legend" size="2" className="yst-mb-2">
						{ __( "Social sharing", "wordpress-seo" ) }
					</Title>
					<Alert id="alert-social-sharing">
						{ __( "Facebook, Twitter and Pinterest all use Facebook's Open Graph data, so be sure to keep the 'Open Graph data' setting below enabled if you want to optimize your site for these social platforms.", "wordpress-seo" ) }
					</Alert>
				</div>
				<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "Open Graph data", "wordpress-seo" ) }
							</Title>
						</Card.Header>
						<Card.Content>
							{ __( "Allows for Facebook and other social media to display a preview with images and a text excerpt when a link to your site is shared.", "wordpress-seo" ) }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo_social.opengraph"
								data-id="input-wpseo_social-opengraph"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "Twitter card data", "wordpress-seo" ) }
							</Title>
						</Card.Header>
						<Card.Content>
							{ __( "Allows for Twitter to display a preview with images and a text excerpt when a link to your site is shared.", "wordpress-seo" ) }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo_social.twitter"
								data-id="input-wpseo_social-twitter"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "Slack sharing", "wordpress-seo" ) }
							</Title>
						</Card.Header>
						<Card.Content>
							{ slackSharingLink }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_enhanced_slack_sharing"
								data-id="input-wpseo-enable_enhanced_slack_sharing"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
				</div>
			</fieldset>
			<hr className="yst-my-8" />
			<fieldset className="yst-min-w-0">
				<div className="yst-max-w-screen-sm yst-mb-8">
					<Title as="legend" size="2">
						{ __( "Tools", "wordpress-seo" ) }
					</Title>
				</div>
				<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "Admin bar menu", "wordpress-seo" ) }
							</Title>
						</Card.Header>
						<Card.Content>
							{ __( "The Yoast SEO admin bar menu contains useful links to third-party tools for analyzing pages and makes it easy to see if you have new notifications.", "wordpress-seo" ) }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_admin_bar_menu"
								data-id="input-wpseo-enable_admin_bar_menu"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
				</div>
			</fieldset>
			<hr className="yst-my-8" />
			<fieldset className="yst-min-w-0">
				<div className="yst-max-w-screen-sm yst-mb-8">
					<Title as="legend" size="2">
						{ __( "APIs", "wordpress-seo" ) }
					</Title>
				</div>
				<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "REST API endpoint", "wordpress-seo" ) }
							</Title>
						</Card.Header>
						<Card.Content>
							{ __( "This Yoast SEO REST API endpoint gives you all the metadata you need for a specific URL. This will make it very easy for headless WordPress sites to use Yoast SEO for all their SEO meta output.", "wordpress-seo" ) }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_headless_rest_endpoints"
								data-id="input-wpseo-enable_headless_rest_endpoints"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "XML sitemaps", "wordpress-seo" ) }
							</Title>
						</Card.Header>
						<Card.Content>
							{ xmlSitemapsLink }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_xml_sitemap"
								data-id="input-wpseo-enable_xml_sitemap"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
					<Card>
						<Card.Header className="yst-justify-start">
							<Title as="h4">
								{ __( "IndexNow", "wordpress-seo" ) }
								<div className="yst-absolute yst-top-2 yst-right-2 yst-flex yst-gap-1.5">
									<Badge size="small" variant="upsell">Premium</Badge>
								</div>
							</Title>
						</Card.Header>
						<Card.Content>
							{ indexNowLink }
						</Card.Content>
						<Card.Footer>
							<FormikValueChangeField
								as={ ToggleField }
								type="checkbox"
								name="wpseo.enable_index_now"
								data-id="input-wpseo-enable_index_now"
								label={ __( "Enable feature", "wordpress-seo" ) }
							/>
						</Card.Footer>
					</Card>
				</div>
			</fieldset>
			<hr className="yst-my-8" />
			<FieldsetLayout title={ __( "Security & privacy", "wordpress-seo" ) }>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.disableadvanced_meta"
					data-id="input-wpseo-disableadvanced_meta"
					label={ __( "Restrict advanced settings for authors", "wordpress-seo" ) }
					description={ __( "By default only editors and administrators can access the Advanced - and Schema section of the Yoast SEO metabox. Disabling this allows access to all users.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.tracking"
					data-id="input-wpseo-tracking"
					label={ __( "Usage tracking", "wordpress-seo" ) }
					description={ usageTrackingLink }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default SitePreferences;

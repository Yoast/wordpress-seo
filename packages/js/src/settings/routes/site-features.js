/* eslint-disable complexity */
import { ArrowNarrowRightIcon, LockOpenIcon } from "@heroicons/react/outline";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Badge, Button, Card, Link, Title, ToggleField as PureToggleField, useSvgAria } from "@yoast/ui-library";
import { useFormikContext } from "formik";
import PropTypes from "prop-types";
import { FormikValueChangeField, FormLayout } from "../components";
import { withDisabledMessageSupport } from "../hocs";
import { useSelectSettings } from "../hooks";

const ToggleField = withDisabledMessageSupport( PureToggleField );

/**
 * @param {string} src The image source.
 * @param {string} alt The image alt text.
 * @param {JSX.node} [children] Optional extra content.
 * @returns {JSX.Element} The card header.
 */
const CardHeader = ( {
	src,
	alt,
	children = null,
} ) => (
	<Card.Header className="yst-h-auto yst-p-0">
		<img
			className="yst-w-full"
			src={ src }
			alt={ alt }
			width={ 500 }
			height={ 250 }
			loading="lazy"
			decoding="async"
		/>
		{ children }
	</Card.Header>
);

CardHeader.propTypes = {
	src: PropTypes.string.isRequired,
	alt: PropTypes.string.isRequired,
	children: PropTypes.node,
};

/**
 * @param {string} id The ID.
 * @param {string} href The link.
 * @returns {JSX.Element} The learn more link.
 */
const LearnMoreLink = ( { id, link } ) => {
	const href = useSelectSettings( "selectLink", [ link ], link );

	return (
		<a
			id={ id }
			href={ href }
			className="yst-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium yst-text-primary-500 hover:yst-text-primary-400"
			rel="noreferrer"
		>
			{ __( "Learn more", "wordpress-seo" ) }
			<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 rtl:-yst-scale-x-100" />
		</a>
	);
};

LearnMoreLink.propTypes = {
	id: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
};

/**
 * @returns {JSX.Element} The site preferences route.
 */
const SiteFeatures = () => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const sitemapUrl = useSelectSettings( "selectPreference", [], "sitemapUrl" );
	const getInclusiveLanguageAnalysisLink = useSelectSettings( "selectLink", [], "https://yoa.st/get-inclusive-language" );
	const getLinkSuggestionsLink = useSelectSettings( "selectLink", [], "https://yoa.st/get-link-suggestions" );
	const getIndexNowLink = useSelectSettings( "selectLink", [], "https://yoa.st/get-indexnow" );
	const svgAriaProps = useSvgAria();

	const { values } = useFormikContext();
	const { enable_xml_sitemap: enableXmlSitemap } = values.wpseo;

	const seoAnalysisImage = useSelectSettings( "selectPluginUrl", [], "/images/seo_analysis.png" );
	const readabilityAnalysisImage = useSelectSettings( "selectPluginUrl", [], "/images/readability_analysis.png" );
	const inclusiveLanguageAnalysisImage = useSelectSettings( "selectPluginUrl", [], "/images/inclusive_language_analysis.png" );
	const insightsImage = useSelectSettings( "selectPluginUrl", [], "/images/insights.png" );
	const cornerstoneContentImage = useSelectSettings( "selectPluginUrl", [], "/images/cornerstone_content.png" );
	const textLinkCounterImage = useSelectSettings( "selectPluginUrl", [], "/images/text_link_counter.png" );
	const linkSuggestionsImage = useSelectSettings( "selectPluginUrl", [], "/images/link_suggestions.png" );
	const openGraphImage = useSelectSettings( "selectPluginUrl", [], "/images/open_graph.png" );
	const twitterImage = useSelectSettings( "selectPluginUrl", [], "/images/twitter_card.png" );
	const slackSharingImage = useSelectSettings( "selectPluginUrl", [], "/images/slack_sharing.png" );
	const adminBarImage = useSelectSettings( "selectPluginUrl", [], "/images/admin_bar.png" );
	const restApiImage = useSelectSettings( "selectPluginUrl", [], "/images/rest_api.png" );
	const xmlSitemapsImage = useSelectSettings( "selectPluginUrl", [], "/images/xml_sitemaps.png" );

	// grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	// yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-2 lg:yst-grid-cols-3 xl:yst-grid-cols-4
	const gridClassNames = useMemo(
		() => isPremium
			? "yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-2 lg:yst-grid-cols-3 xl:yst-grid-cols-4"
			: "yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-1 md:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-3 2xl:yst-grid-cols-4",
		[ isPremium ]
	);

	return (
		<FormLayout
			title={ __( "Site features", "wordpress-seo" ) }
			description={ __( "Tell us which features you want to use.", "wordpress-seo" ) }
		>
			<div className="yst-max-w-6xl">
				<fieldset className="yst-min-w-0">
					<legend className="yst-sr-only">{ __( "Writing", "wordpress-seo" ) }</legend>
					<div className="yst-max-w-screen-sm yst-mb-8">
						<Title as="h2" size="2">
							{ __( "Writing", "wordpress-seo" ) }
						</Title>
					</div>
					<div className={ gridClassNames }>
						<Card id="card-wpseo-keyword_analysis_active">
							<CardHeader
								src={ seoAnalysisImage }
								alt={ __( "SEO analysis", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "SEO analysis", "wordpress-seo" ) }
								</Title>
								<p>{ __( "The SEO analysis offers suggestions to improve the findability of your text and makes sure that your content meets best practices.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-seo-analysis" link="https://yoa.st/2ak" />
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
						<Card id="card-wpseo-content_analysis_active">
							<CardHeader
								src={ readabilityAnalysisImage }
								alt={ __( "Readability analysis", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "Readability analysis", "wordpress-seo" ) }
								</Title>
								<p>{ __( "The readability analysis offers suggestions to improve the structure and style of your text.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-readability-analysis" link="https://yoa.st/2ao" />
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
						<Card id="card-wpseo-inclusive_language_analysis_active">
							<CardHeader
								src={ inclusiveLanguageAnalysisImage }
								alt={ __( "Inclusive language analysis", "wordpress-seo" ) }
							>
								<div className="yst-absolute yst-top-2 yst-right-2 yst-flex yst-gap-1.5">
									{ isPremium && <Badge size="small" variant="upsell">Premium</Badge> }
									<Badge size="small" variant="info">Beta</Badge>
								</div>
							</CardHeader>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "Inclusive language analysis", "wordpress-seo" ) }
								</Title>
								<p>{ __( "The inclusive language analysis offers suggestions to write more inclusive copy, so more people will be able to relate to your content.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-inclusive-language-analysis" link="https://yoa.st/inclusive-language-analysis" />
							</Card.Content>
							<Card.Footer>
								{ isPremium && <FormikValueChangeField
									as={ ToggleField }
									type="checkbox"
									name="wpseo.inclusive_language_analysis_active"
									data-id="input-wpseo-inclusive_language_analysis_active"
									label={ __( "Enable feature", "wordpress-seo" ) }
								/> }
								{ ! isPremium && (
									<Button as="a" className="yst-gap-2 yst-w-full" variant="upsell" href={ getInclusiveLanguageAnalysisLink } target="_blank">
										<LockOpenIcon className="yst-w-5 yst-h-5 yst--ml-1 yst-shrink-0" { ...svgAriaProps } />
										{ sprintf(
											/* translators: %1$s expands to Premium. */
											__( "Unlock with %1$s", "wordpress-seo" ),
											"Premium"
										) }
									</Button>
								) }
							</Card.Footer>
						</Card>
						<Card id="card-wpseo-enable_metabox_insights">
							<CardHeader
								src={ insightsImage }
								alt={ __( "Insights", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "Insights", "wordpress-seo" ) }
								</Title>
								<p>{ __( "Get more insights into what you are writing. What words do you use most often? How much time does it take to read your text? Is your text easy to read?", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-insights" link="https://yoa.st/4ew" />
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
					<legend className="yst-sr-only">{ __( "Site structure", "wordpress-seo" ) }</legend>
					<div className="yst-max-w-screen-sm yst-mb-8">
						<Title as="h3" size="2">
							{ __( "Site structure", "wordpress-seo" ) }
						</Title>
					</div>
					<div className={ gridClassNames }>
						<Card id="card-wpseo-enable_cornerstone_content">
							<CardHeader
								src={ cornerstoneContentImage }
								alt={ __( "Cornerstone content", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "Cornerstone content", "wordpress-seo" ) }
								</Title>
								<p>{ __( "Mark and filter your cornerstone content to make sure your most important articles get the attention they deserve. To help you write excellent copy, we’ll assess your text more strictly.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-cornerstone-content" link="https://yoa.st/dashboard-help-cornerstone" />
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
						<Card id="card-wpseo-enable_text_link_counter">
							<CardHeader
								src={ textLinkCounterImage }
								alt={ __( "Text link counter", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "Text link counter", "wordpress-seo" ) }
								</Title>
								<p>{ __( "Count the number of internal links from and to your posts to improve your site structure.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-text-link-counter" link="https://yoa.st/2aj" />
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
						<Card id="card-wpseo-enable_link_suggestions">
							<CardHeader
								src={ linkSuggestionsImage }
								alt={ __( "Link suggestions", "wordpress-seo" ) }
							>
								<div className="yst-absolute yst-top-2 yst-right-2 yst-flex yst-gap-1.5">
									{ isPremium && <Badge size="small" variant="upsell">Premium</Badge> }
								</div>
							</CardHeader>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "Link suggestions", "wordpress-seo" ) }
								</Title>
								<p>{ __( "Get recommendations for relevant posts to link to and set up a great internal linking structure by connecting related content.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-suggestions-link" link={ isPremium ? "https://yoa.st/17g" : "https://yoa.st/4ev" } />
							</Card.Content>
							<Card.Footer>
								{ isPremium && <FormikValueChangeField
									as={ ToggleField }
									type="checkbox"
									name="wpseo.enable_link_suggestions"
									data-id="input-wpseo-enable_link_suggestions"
									label={ __( "Enable feature", "wordpress-seo" ) }
								/> }
								{ ! isPremium && (
									<Button as="a" className="yst-gap-2 yst-w-full" variant="upsell" href={ getLinkSuggestionsLink } target="_blank">
										<LockOpenIcon className="yst-w-5 yst-h-5 yst--ml-1 yst-shrink-0" { ...svgAriaProps } />
										{ sprintf(
											/* translators: %1$s expands to Premium. */
											__( "Unlock with %1$s", "wordpress-seo" ),
											"Premium"
										) }
									</Button>
								) }
							</Card.Footer>
						</Card>
					</div>
				</fieldset>
				<hr className="yst-my-8" />
				<fieldset id="section-social-sharing" className="yst-min-w-0">
					<legend className="yst-sr-only">{ __( "Social sharing", "wordpress-seo" ) }</legend>
					<div className="yst-max-w-screen-sm yst-mb-8">
						<Title as="legend" size="2" className="yst-mb-2">
							{ __( "Social sharing", "wordpress-seo" ) }
						</Title>
						<Alert id="alert-social-sharing">
							{ __( "Facebook, Twitter and Pinterest all use Facebook's Open Graph data, so be sure to keep the 'Open Graph data' setting below enabled if you want to optimize your site for these social platforms.", "wordpress-seo" ) }
						</Alert>
					</div>
					<div className={ gridClassNames }>
						<Card id="card-wpseo_social-opengraph">
							<CardHeader
								src={ openGraphImage }
								alt={ __( "Open Graph data", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "Open Graph data", "wordpress-seo" ) }
								</Title>
								<p>{ __( "Allows for Facebook and other social media to display a preview with images and a text excerpt when a link to your site is shared.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-open-graph-data" link="https://yoa.st/site-features-open-graph-data" />
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
						<Card id="card-wpseo_social-twitter">
							<CardHeader
								src={ twitterImage }
								alt={ __( "Twitter card data", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "Twitter card data", "wordpress-seo" ) }
								</Title>
								<p>{ __( "Allows for Twitter to display a preview with images and a text excerpt when a link to your site is shared.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-twitter-card-data" link="https://yoa.st/site-features-twitter-card-data" />
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
						<Card id="card-wpseo-enable_enhanced_slack_sharing">
							<CardHeader
								src={ slackSharingImage }
								alt={ __( "Slack sharing", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "Slack sharing", "wordpress-seo" ) }
								</Title>
								<p>{ __( "This adds an author byline and reading time estimate to the article’s snippet when shared on Slack.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-slack-sharing" link="https://yoa.st/help-slack-share" />
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
					<legend className="yst-sr-only">{ __( "Tools", "wordpress-seo" ) }</legend>
					<div className="yst-max-w-screen-sm yst-mb-8">
						<Title as="h2" size="2">
							{ __( "Tools", "wordpress-seo" ) }
						</Title>
					</div>
					<div className={ gridClassNames }>
						<Card id="card-wpseo-enable_admin_bar_menu">
							<CardHeader
								src={ adminBarImage }
								alt={ __( "Admin bar menu", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "Admin bar menu", "wordpress-seo" ) }
								</Title>
								<p>
									{ sprintf(
										// translators: %1$s expands to Yoast.
										__( "The %1$s icon in the top admin bar provides quick access to third-party tools for analyzing pages and makes it easy to see if you have new notifications.", "wordpress-seo" ),
										"Yoast"
									) }
								</p>
								<LearnMoreLink id="link-admin-bar" link="https://yoa.st/site-features-admin-bar" />
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
					<legend className="yst-sr-only">{ __( "APIs", "wordpress-seo" ) }</legend>
					<div className="yst-max-w-screen-sm yst-mb-8">
						<Title as="h2" size="2">
							{ __( "APIs", "wordpress-seo" ) }
						</Title>
					</div>
					<div className={ gridClassNames }>
						<Card id="card-wpseo-enable_headless_rest_endpoints">
							<CardHeader
								src={ restApiImage }
								alt={ __( "REST API endpoint", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "REST API endpoint", "wordpress-seo" ) }
								</Title>
								<p>{ __( "This Yoast SEO REST API endpoint gives you all the metadata you need for a specific URL. This will make it very easy for headless WordPress sites to use Yoast SEO for all their SEO meta output.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-rest-api-endpoint" link="https://yoa.st/site-features-rest-api-endpoint" />
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
						<Card id="card-wpseo-enable_xml_sitemap">
							<CardHeader
								src={ xmlSitemapsImage }
								alt={ __( "XML sitemaps", "wordpress-seo" ) }
							/>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "XML sitemaps", "wordpress-seo" ) }
								</Title>
								<p>
									{ sprintf(
										// translators: %1$s expands to Yoast SEO.
										__( "Enable the %1$s XML sitemaps. A sitemap is a file that lists a website's essential pages to make sure search engines can find and crawl them.", "wordpress-seo" ),
										"Yoast SEO"
									) }
								</p>
								{ enableXmlSitemap && <Link id="link-xml-sitemaps" href={ sitemapUrl } target="_blank">
									{ __( "View the XML sitemap", "wordpress-seo" ) }
								</Link> }
								<LearnMoreLink id="link-xml-sitemaps" link="https://yoa.st/2a-" />
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
						<Card id="card-wpseo-enable_index_now">
							<Card.Header>
								<div className="yst-absolute yst-top-2 yst-right-2 yst-flex yst-gap-1.5">
									{ isPremium && <Badge size="small" variant="upsell">Premium</Badge> }
								</div>
							</Card.Header>
							<Card.Content className="yst-flex yst-flex-col yst-gap-3">
								<Title as="h3">
									{ __( "IndexNow", "wordpress-seo" ) }
								</Title>
								<p>{ __( "Automatically ping search engines like Bing and Yandex whenever you publish, update or delete a post.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-index-now" link="https://yoa.st/index-now-feature" />
							</Card.Content>
							<Card.Footer>
								{ isPremium && <FormikValueChangeField
									as={ ToggleField }
									type="checkbox"
									name="wpseo.enable_index_now"
									data-id="input-wpseo-enable_index_now"
									label={ __( "Enable feature", "wordpress-seo" ) }
								/> }
								{ ! isPremium && (
									<Button as="a" className="yst-gap-2 yst-w-full" variant="upsell" href={ getIndexNowLink } target="_blank">
										<LockOpenIcon className="yst-w-5 yst-h-5 yst--ml-1 yst-shrink-0" { ...svgAriaProps } />
										{ sprintf(
											/* translators: %1$s expands to Premium. */
											__( "Unlock with %1$s", "wordpress-seo" ),
											"Premium"
										) }
									</Button>
								) }
							</Card.Footer>
						</Card>
					</div>
				</fieldset>
			</div>
		</FormLayout>
	);
};

export default SiteFeatures;

/* eslint-disable complexity */
import { ArrowNarrowRightIcon, ExternalLinkIcon, LockOpenIcon } from "@heroicons/react/outline";
import { useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Badge, Button, Card, Link, Title, ToggleField, useSvgAria } from "@yoast/ui-library";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { get } from "lodash";
import PropTypes from "prop-types";
import { FormikValueChangeField, FormLayout, RouteLayout } from "../components";
import { useDisabledMessage, useSelectSettings } from "../hooks";

/**
 * @param {string} name The field name.
 * @param {string} cardId The card ID.
 * @param {string} inputId The input ID.
 * @param {string} imageSrc The image src, will get prefixed with the plugin URL.
 * @param {string} imageAlt The image alt text.
 * @param {JSX.node} children The card content.
 * @param {boolean} isPremiumFeature Whether this card is for a premium feature.
 * @param {boolean}  isBetaFeature Whether this card is for a beta feature.
 * @param {string} isPremiumLink The link to use for the upsell. Required for premium features.
 * @returns {JSX.Element} The card.
 */
const FeatureCard = ( {
	name,
	cardId,
	inputId,
	children,
	imageSrc: rawImageSrc,
	imageAlt,
	isPremiumFeature = false,
	isPremiumLink = "",
	isBetaFeature = false,
	isNewFeature = false,
	hasPremiumBadge = false,
	title,
} ) => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const imageSrc = useSelectSettings( "selectPluginUrl", [ rawImageSrc ], rawImageSrc );
	const { isDisabled, message, disabledSetting } = useDisabledMessage( { name } );
	const { values } = useFormikContext();
	const isPremiumHref = useSelectSettings( "selectLink", [ isPremiumLink ], isPremiumLink );
	const premiumUpsellConfig = useSelectSettings( "selectUpsellSettingsAsProps" );
	const svgAriaProps = useSvgAria();
	const value = useMemo( () => get( values, name, false ), [ values, name ] );
	const shouldUpsell = useMemo( () => ! isPremium && isPremiumFeature, [ isPremium, isPremiumFeature ] );
	const shouldDimHeaderImage = useMemo( () => isDisabled || ( shouldUpsell ? false : ! value ), [ isDisabled, shouldUpsell, value ] );
	const shouldRenderBadgeContainer = useMemo(
		() => isDisabled || ( isPremium && isPremiumFeature && hasPremiumBadge ) || isBetaFeature || ( isNewFeature && ! isPremium ),
		[ isDisabled, isPremium, isPremiumFeature, isBetaFeature, isNewFeature ]
	);

	return (
		<Card id={ cardId }>
			<Card.Header className="yst-h-auto yst-p-0">
				<img
					className={ classNames(
						"yst-w-full yst-transition yst-duration-200",
						shouldDimHeaderImage && "yst-opacity-50 yst-filter yst-grayscale"
					) }
					src={ imageSrc }
					alt={ imageAlt ?? "" }
					width={ 500 }
					height={ 250 }
					loading="lazy"
					decoding="async"
				/>
				{ shouldRenderBadgeContainer && (
					<div className="yst-absolute yst-top-2 yst-end-2 yst-flex yst-gap-1.5">
						{ isDisabled && <Badge size="small" variant="plain">{ message }</Badge> }
						{ isPremium && isPremiumFeature && hasPremiumBadge && <Badge size="small" variant="upsell">Premium</Badge> }
						{ isBetaFeature && <Badge size="small" variant="info">Beta</Badge> }
						{ isNewFeature && ! isPremium && <Badge size="small" variant="info">New</Badge> }
					</div>
				) }
			</Card.Header>
			<Card.Content className="yst-flex yst-flex-col yst-gap-3">
				<Title as="h3">{ title }</Title>
				{ children }
			</Card.Content>
			<Card.Footer>
				{ ! shouldUpsell && <FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name={ name }
					id={ inputId }
					aria-label={ `${ __( "Enable feature", "wordpress-seo" ) } ${ title }` }
					label={ __( "Enable feature", "wordpress-seo" ) }
					disabled={ isDisabled }
					checked={ disabledSetting === "language" ? false : value }
				/> }
				{ shouldUpsell && (
					<Button
						as="a"
						className="yst-gap-2 yst-w-full yst-px-2"
						variant="upsell"
						href={ isPremiumHref }
						target="_blank"
						rel="noopener"
						{ ...premiumUpsellConfig }
					>
						<LockOpenIcon className="yst-w-5 yst-h-5 yst--ms-1 yst-shrink-0" { ...svgAriaProps } />
						{ sprintf(
							/* translators: %1$s expands to Premium. */
							__( "Unlock with %1$s", "wordpress-seo" ),
							"Premium"
						) }
					</Button>
				) }
			</Card.Footer>
		</Card>
	);
};

FeatureCard.propTypes = {
	name: PropTypes.string.isRequired,
	cardId: PropTypes.string.isRequired,
	inputId: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	imageSrc: PropTypes.string.isRequired,
	imageAlt: PropTypes.string,
	isPremiumFeature: PropTypes.bool,
	isBetaFeature: PropTypes.bool,
	isNewFeature: PropTypes.bool,
	isPremiumLink: PropTypes.string,
	hasPremiumBadge: PropTypes.bool,
	title: PropTypes.string.isRequired,
};

/**
 * @param {string} id The ID.
 * @param {string} href The link.
 * @returns {JSX.Element} The learn more link.
 */
const LearnMoreLink = ( { id, link, ariaLabel, ...props } ) => {
	const href = useSelectSettings( "selectLink", [ link ], link );

	return (
		<Link
			id={ id }
			href={ href }
			variant="primary"
			className="yst-flex yst-items-center yst-gap-1 yst-no-underline yst-font-medium"
			target="_blank"
			rel="noopener"
			aria-label={
				sprintf(
					/* translators: Hidden accessibility text; %s expands to a translated string of this feature, e.g. "SEO analysis". */
					__( "Learn more about %s (Opens in a new browser tab)", "wordpress-seo" ),
					ariaLabel
				)
			}
			{ ...props }
		>
			{ __( "Learn more", "wordpress-seo" ) }
			<ArrowNarrowRightIcon className="yst-w-4 yst-h-4 yst-icon-rtl" />
		</Link>
	);
};

LearnMoreLink.propTypes = {
	id: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	ariaLabel: PropTypes.string.isRequired,
};

/**
 * @returns {JSX.Element} The site preferences route.
 */
const SiteFeatures = () => {
	const isPremium = useSelectSettings( "selectPreference", [], "isPremium" );
	const sitemapUrl = useSelectSettings( "selectPreference", [], "sitemapUrl" );
	const { values, initialValues } = useFormikContext();
	const { enable_xml_sitemap: enableXmlSitemap } = values.wpseo;
	const { enable_xml_sitemap: initialEnableXmlSitemap } = initialValues.wpseo;

	// grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	// yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-2 lg:yst-grid-cols-3 xl:yst-grid-cols-4
	const gridClassNames = useMemo(
		() => isPremium
			? "yst-grid yst-gap-6 yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 xl:yst-grid-cols-3 2xl:yst-grid-cols-4"
			: "yst-grid yst-gap-6 yst-grid-cols-1 sm:yst-grid-cols-2 min-[783px]:yst-grid-cols-1 lg:yst-grid-cols-2 2xl:yst-grid-cols-3 min-[1800px]:yst-grid-cols-4",
		[ isPremium ]
	);

	return (
		<RouteLayout
			title={ __( "Site features", "wordpress-seo" ) }
			description={ __( "Tell us which features you want to use.", "wordpress-seo" ) }
		>
			<FormLayout>
				<div className="yst-max-w-6xl">
					<fieldset className="yst-min-w-0">
						<legend className="yst-sr-only">{ __( "Writing", "wordpress-seo" ) }</legend>
						<div className="yst-max-w-screen-sm yst-mb-8">
							<Title as="h2" size="2">
								{ __( "Writing", "wordpress-seo" ) }
							</Title>
						</div>
						<div className={ gridClassNames }>
							<FeatureCard
								name="wpseo.keyword_analysis_active"
								cardId="card-wpseo-keyword_analysis_active"
								inputId="input-wpseo-keyword_analysis_active"
								imageSrc="/images/seo_analysis.png"
								title={ __( "SEO analysis", "wordpress-seo" ) }
							>
								<p>{ __( "The SEO analysis offers suggestions to improve the findability of your text and makes sure that your content meets best practices.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-seo-analysis" link="https://yoa.st/2ak" ariaLabel={ __( "SEO analysis", "wordpress-seo" ) } />
							</FeatureCard>
							<FeatureCard
								name="wpseo.content_analysis_active"
								cardId="card-wpseo-content_analysis_active"
								inputId="input-wpseo-content_analysis_active"
								imageSrc="/images/readability_analysis.png"
								title={ __( "Readability analysis", "wordpress-seo" ) }
							>
								<p>{ __( "The readability analysis offers suggestions to improve the structure and style of your text.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-readability-analysis" link="https://yoa.st/2ao" ariaLabel={ __( "Readability analysis", "wordpress-seo" ) } />
							</FeatureCard>
							<FeatureCard
								name="wpseo.inclusive_language_analysis_active"
								cardId="card-wpseo-inclusive_language_analysis_active"
								inputId="input-wpseo-inclusive_language_analysis_active"
								imageSrc="/images/inclusive_language_analysis.png"
								title={ __( "Inclusive language analysis", "wordpress-seo" ) }
							>
								<p>{ __( "The inclusive language analysis offers suggestions to write more inclusive copy, so more people will be able to relate to your content.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-inclusive-language-analysis" link="https://yoa.st/inclusive-language-feature-learn-more" ariaLabel={  __( "Inclusive language analysis", "wordpress-seo" ) } />
							</FeatureCard>
							<FeatureCard
								name="wpseo.enable_ai_generator"
								cardId="card-wpseo-enable_ai_generator"
								inputId="input-wpseo-enable_ai_generator"
								imageSrc="/images/ai-generator.png"
								isPremiumFeature={ true }
								hasPremiumBadge={ false }
								isBetaFeature={ true }
								isPremiumLink="https://yoa.st/get-ai-generator"
								title={ "Yoast AI" }
							>
								<p>{ __( "The AI features help you create better content by providing optimization suggestions that you can apply as you wish.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-ai-generator" link="https://yoa.st/ai-generator-feature" ariaLabel={ __( "AI title & description generator", "wordpress-seo" ) } />
							</FeatureCard>
							<FeatureCard
								name="wpseo.enable_metabox_insights"
								cardId="card-wpseo-enable_metabox_insights"
								inputId="input-wpseo-enable_metabox_insights"
								imageSrc="/images/insights.png"
								title={ __( "Insights", "wordpress-seo" ) }
							>
								<p>{ __( "Get more insights into what you are writing. What words do you use most often? How much time does it take to read your text? Is your text easy to read?", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-insights" link="https://yoa.st/4ew" ariaLabel={ __( "Insights", "wordpress-seo" ) } />
							</FeatureCard>
						</div>
					</fieldset>
					<hr className="yst-my-8" />
					<fieldset className="yst-min-w-0">
						<legend className="yst-sr-only">{ __( "Site structure", "wordpress-seo" ) }</legend>
						<div className="yst-max-w-screen-sm yst-mb-8">
							<Title as="h2" size="2">{ __( "Site structure", "wordpress-seo" ) }</Title>
						</div>
						<div className={ gridClassNames }>
							<FeatureCard
								name="wpseo.enable_cornerstone_content"
								cardId="card-wpseo-enable_cornerstone_content"
								inputId="input-wpseo-enable_cornerstone_content"
								imageSrc="/images/cornerstone_content.png"
								title={ __( "Cornerstone content", "wordpress-seo" ) }
							>
								<p>{ __( "Mark and filter your cornerstone content to make sure your most important articles get the attention they deserve. To help you write excellent copy, we’ll assess your text more strictly.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-cornerstone-content" link="https://yoa.st/dashboard-help-cornerstone" ariaLabel={  __( "Cornerstone content", "wordpress-seo" ) } />
							</FeatureCard>
							<FeatureCard
								name="wpseo.enable_text_link_counter"
								cardId="card-wpseo-enable_text_link_counter"
								inputId="input-wpseo-enable_text_link_counter"
								imageSrc="/images/text_link_counter.png"
								title={ __( "Text link counter", "wordpress-seo" ) }
							>
								<p>{ __( "Count the number of internal links from and to your posts to improve your site structure.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-text-link-counter" link="https://yoa.st/2aj" ariaLabel={ __( "Text link counter", "wordpress-seo" ) } />
							</FeatureCard>
							<FeatureCard
								name="wpseo.enable_link_suggestions"
								cardId="card-wpseo-enable_link_suggestions"
								inputId="input-wpseo-enable_link_suggestions"
								imageSrc="/images/link_suggestions.png"
								isPremiumFeature={ true }
								hasPremiumBadge={ true }
								isPremiumLink="https://yoa.st/get-link-suggestions"
								title={ __( "Internal linking suggestions", "wordpress-seo" ) }
							>
								<p>{ __( "No need to figure out what to link to. You get linking suggestions for relevant posts and pages to make your website easier to navigate.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-suggestions-link" link={ isPremium ? "https://yoa.st/17g" : "https://yoa.st/4ev" } ariaLabel={ __( "Link suggestions", "wordpress-seo" ) } />
							</FeatureCard>
						</div>
					</fieldset>
					<hr className="yst-my-8" />
					<fieldset id="section-social-sharing" className="yst-min-w-0">
						<legend className="yst-sr-only">{ __( "Social sharing", "wordpress-seo" ) }</legend>
						<div className="yst-max-w-screen-sm yst-mb-8">
							<Title as="h2" size="2" className="yst-mb-2">{ __( "Social sharing", "wordpress-seo" ) }</Title>
						</div>
						<div className={ gridClassNames }>
							<FeatureCard
								name="wpseo_social.opengraph"
								cardId="card-wpseo_social-opengraph"
								inputId="input-wpseo_social-opengraph"
								imageSrc="/images/open_graph.png"
								title={ __( "Open Graph data", "wordpress-seo" ) }
							>
								<p>
									{ __( "Allows for Facebook and other social media to display a preview with images and a text excerpt when a link to your site is shared. Keep this feature enabled to optimize your site for social media.", "wordpress-seo" ) }
								</p>
								<LearnMoreLink id="link-open-graph-data" link="https://yoa.st/site-features-open-graph-data" ariaLabel={ __( "Open Graph data", "wordpress-seo" ) } />
							</FeatureCard>
							<FeatureCard
								name="wpseo_social.twitter"
								cardId="card-wpseo_social-twitter"
								inputId="input-wpseo_social-twitter"
								imageSrc="/images/twitter_card.png"
								title={ __( "X card data", "wordpress-seo" ) }
							>
								<p>{ __( "Allows for X to display a preview with images and a text excerpt when a link to your site is shared.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-twitter-card-data" link="https://yoa.st/site-features-twitter-card-data" ariaLabel={ __( "X card data", "wordpress-seo" ) } />
							</FeatureCard>
							<FeatureCard
								name="wpseo.enable_enhanced_slack_sharing"
								cardId="card-wpseo-enable_enhanced_slack_sharing"
								inputId="input-wpseo-enable_enhanced_slack_sharing"
								imageSrc="/images/slack_sharing.png"
								title={ __( "Slack sharing", "wordpress-seo" ) }
							>
								<p>{ __( "This adds an author byline and reading time estimate to the article’s snippet when shared on Slack.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-slack-sharing" link="https://yoa.st/help-slack-share" ariaLabel={ __( "Slack sharing", "wordpress-seo" ) } />
							</FeatureCard>
						</div>
					</fieldset>
					<hr className="yst-my-8" />
					<fieldset className="yst-min-w-0">
						<legend className="yst-sr-only">{ __( "Tools", "wordpress-seo" ) }</legend>
						<div className="yst-max-w-screen-sm yst-mb-8">
							<Title as="h2" size="2">{ __( "Tools", "wordpress-seo" ) }</Title>
						</div>
						<div className={ gridClassNames }>
							<FeatureCard
								name="wpseo.enable_admin_bar_menu"
								cardId="card-wpseo-enable_admin_bar_menu"
								inputId="input-wpseo-enable_admin_bar_menu"
								imageSrc="/images/admin_bar.png"
								title={ __( "Admin bar menu", "wordpress-seo" ) }
							>
								<p>
									{ sprintf(
										// translators: %1$s expands to Yoast.
										__( "The %1$s icon in the top admin bar provides quick access to third-party tools for analyzing pages and makes it easy to see if you have new notifications.", "wordpress-seo" ),
										"Yoast"
									) }
								</p>
								<LearnMoreLink id="link-admin-bar" link="https://yoa.st/site-features-admin-bar" ariaLabel={ __( "Admin bar menu", "wordpress-seo" ) } />
							</FeatureCard>
						</div>
					</fieldset>
					<hr className="yst-my-8" />
					<fieldset className="yst-min-w-0">
						<legend className="yst-sr-only">{ __( "APIs", "wordpress-seo" ) }</legend>
						<div className="yst-max-w-screen-sm yst-mb-8">
							<Title as="h2" size="2">{ __( "APIs", "wordpress-seo" ) }</Title>
						</div>
						<div className={ gridClassNames }>
							<FeatureCard
								name="wpseo.enable_headless_rest_endpoints"
								cardId="card-wpseo-enable_headless_rest_endpoints"
								inputId="input-wpseo-enable_headless_rest_endpoints"
								imageSrc="/images/rest_api.png"
								title={ __( "REST API endpoint", "wordpress-seo" ) }
							>
								<p>{ __( "This Yoast SEO REST API endpoint gives you all the metadata you need for a specific URL. This will make it very easy for headless WordPress sites to use Yoast SEO for all their SEO meta output.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-rest-api-endpoint" link="https://yoa.st/site-features-rest-api-endpoint" ariaLabel={ __( "REST API endpoint", "wordpress-seo" ) } />
							</FeatureCard>
							<FeatureCard
								name="wpseo.enable_xml_sitemap"
								cardId="card-wpseo-enable_xml_sitemap"
								inputId="input-wpseo-enable_xml_sitemap"
								imageSrc="/images/xml_sitemaps.png"
								title={ __( "XML sitemaps", "wordpress-seo" ) }
							>
								<p>
									{ sprintf(
										// translators: %1$s expands to "Yoast SEO".
										__( "Enable the %1$s XML sitemaps. A sitemap is a file that lists a website's essential pages to make sure search engines can find and crawl them.", "wordpress-seo" ),
										"Yoast SEO"
									) }
								</p>
								{ initialEnableXmlSitemap && enableXmlSitemap && <Button
									as="a"
									id="link-xml-sitemaps"
									href={ sitemapUrl }
									variant="secondary"
									target="_blank"
									rel="noopener"
									className="yst-self-start"
								>
									{ __( "View the XML sitemap", "wordpress-seo" ) }
									<ExternalLinkIcon className="yst--me-1 yst-ms-1 yst-h-5 yst-w-5 yst-text-slate-400 rtl:yst-rotate-[270deg]" />
								</Button> }
								<LearnMoreLink id="link-xml-sitemaps-learn-more" link="https://yoa.st/2a-" ariaLabel={ __( "XML sitemaps", "wordpress-seo" ) } />
							</FeatureCard>
							<FeatureCard
								name="wpseo.enable_index_now"
								cardId="card-wpseo-enable_index_now"
								inputId="input-wpseo-enable_index_now"
								imageSrc="/images/indexnow.png"
								isPremiumFeature={ true }
								hasPremiumBadge={ true }
								isPremiumLink="https://yoa.st/get-indexnow"
								title={ __( "IndexNow", "wordpress-seo" ) }
							>
								<p>{ __( "Automatically ping search engines like Bing and Yandex whenever you publish, update or delete a post.", "wordpress-seo" ) }</p>
								<LearnMoreLink id="link-index-now" link="https://yoa.st/index-now-feature" ariaLabel={ __( "IndexNow", "wordpress-seo" ) } />
							</FeatureCard>
						</div>
					</fieldset>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default SiteFeatures;

import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Badge, ToggleField as PureToggleField } from "@yoast/ui-library";
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
		link: "https://yoa.st/",
		/* translators: %1$s expands to an opening tag. %2$s expands to a closing tag. */
		content: __( "The inclusive language analysis offers suggestions to write more inclusive copy. %1$sDiscover why inclusive language is important for SEO%2$s.", "wordpress-seo" ),
		id: "link-inclusive-language-analysis",
	} );

	return (
		<FormLayout
			title={ __( "Site preferences", "wordpress-seo" ) }
			description={ __( "Tell us which features you want to use.", "wordpress-seo" ) }
		>
			<FieldsetLayout title={ __( "Copywriting", "wordpress-seo" ) }>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.keyword_analysis_active"
					data-id="input-wpseo-keyword_analysis_active"
					label={ __( "SEO analysis", "wordpress-seo" ) }
					description={ seoAnalysisLink }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.content_analysis_active"
					data-id="input-wpseo-content_analysis_active"
					label={ __( "Readability analysis", "wordpress-seo" ) }
					description={ readabilityAnalysisLink }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.inclusive_language_analysis_active"
					data-id="input-wpseo-inclusive_language_analysis_active"
					label={ __( "Inclusive language analysis", "wordpress-seo" ) }
					labelSuffix={ <>
						<Badge className="yst-ml-1.5" size="default" variant="upsell">Premium</Badge>
						<Badge className="yst-ml-1.5" size="default" variant="info">Beta</Badge>
					</> }
					description={ inclusiveLanguageAnalysisLink }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_metabox_insights"
					data-id="input-wpseo-enable_metabox_insights"
					label={ __( "Insights", "wordpress-seo" ) }
					description={ insightsLink }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout title={ __( "Site structure", "wordpress-seo" ) }>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_cornerstone_content"
					data-id="input-wpseo-enable_cornerstone_content"
					label={ __( "Cornerstone content", "wordpress-seo" ) }
					description={ cornerstoneContentLink }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_text_link_counter"
					data-id="input-wpseo-enable_text_link_counter"
					label={ __( "Text link counter", "wordpress-seo" ) }
					description={ textLinkCounterLink }
				/>
				{ isPremium && <FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_link_suggestions"
					data-id="input-wpseo-enable_link_suggestions"
					label={ __( "Link suggestions", "wordpress-seo" ) }
					labelSuffix={ <Badge className="yst-ml-1.5" size="small" variant="upsell">Premium</Badge> }
					description={ linkSuggestionsLink }
				/> }
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout id="section-social-sharing" title={ __( "Social sharing", "wordpress-seo" ) }>
				<Alert id="alert-social-sharing">
					{ __( "Facebook, Twitter and Pinterest all use Facebook's Open Graph data, so be sure to keep the 'Open Graph data' setting below enabled if you want to optimize your site for these social platforms.", "wordpress-seo" ) }
				</Alert>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo_social.opengraph"
					data-id="input-wpseo_social-opengraph"
					label={ __( "Open Graph data", "wordpress-seo" ) }
					description={ __( "Allows for Facebook and other social media to display a preview with images and a text excerpt when a link to your site is shared.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo_social.twitter"
					data-id="input-wpseo_social-twitter"
					label={ __( "Twitter card data", "wordpress-seo" ) }
					description={ __( "Allows for Twitter to display a preview with images and a text excerpt when a link to your site is shared.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_enhanced_slack_sharing"
					data-id="input-wpseo-enable_enhanced_slack_sharing"
					label={ __( "Slack sharing", "wordpress-seo" ) }
					description={ slackSharingLink }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout title={ __( "Tools", "wordpress-seo" ) }>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_admin_bar_menu"
					data-id="input-wpseo-enable_admin_bar_menu"
					label={ __( "Admin bar menu", "wordpress-seo" ) }
					description={ __( "The Yoast SEO admin bar menu contains useful links to third-party tools for analyzing pages and makes it easy to see if you have new notifications.", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout title={ __( "APIs", "wordpress-seo" ) }>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_headless_rest_endpoints"
					data-id="input-wpseo-enable_headless_rest_endpoints"
					label={ __( "REST API endpoint", "wordpress-seo" ) }
					description={ __( "This Yoast SEO REST API endpoint gives you all the metadata you need for a specific URL. This will make it very easy for headless WordPress sites to use Yoast SEO for all their SEO meta output.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_xml_sitemap"
					data-id="input-wpseo-enable_xml_sitemap"
					label={ __( "XML sitemaps", "wordpress-seo" ) }
					description={ xmlSitemapsLink }
				/>
				{ isPremium && <FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_index_now"
					data-id="input-wpseo-enable_index_now"
					label={ __( "IndexNow", "wordpress-seo" ) }
					labelSuffix={ <Badge className="yst-ml-1.5" size="small" variant="upsell">Premium</Badge> }
					description={ indexNowLink }
				/> }
			</FieldsetLayout>
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

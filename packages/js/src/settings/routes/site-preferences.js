import { __ } from "@wordpress/i18n";
import { Alert, Badge, ToggleField } from "@yoast/ui-library";
import { FormikValueChangeField, FormLayout, FieldsetLayout } from "../components";

/**
 * @returns {JSX.Element} The site preferences route.
 */
const SitePreferences = () => {
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
					data-id="input:wpseo.keyword_analysis_active"
					label={ __( "SEO analysis", "wordpress-seo" ) }
					description={ __( "The SEO analysis offers suggestions to improve the SEO of your text.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.content_analysis_active"
					data-id="input:wpseo.content_analysis_active"
					label={ __( "Readability analysis", "wordpress-seo" ) }
					description={ __( "The readability analysis offers suggestions to improve the structure and style of your text.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_metabox_insights"
					data-id="input:wpseo.enable_metabox_insights"
					label={ __( "Insights", "wordpress-seo" ) }
					description={ __( "The Insights section in our metabox shows you useful data about your content, like what words you use most often.", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout title={ __( "Site structure", "wordpress-seo" ) }>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_cornerstone_content"
					data-id="input:wpseo.enable_cornerstone_content"
					label={ __( "Cornerstone content", "wordpress-seo" ) }
					description={ __( "The cornerstone content feature lets you to mark and filter cornerstone content on your website.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_text_link_counter"
					data-id="input:wpseo.enable_text_link_counter"
					label={ __( "Text link counter", "wordpress-seo" ) }
					description={ __( "The text link counter helps you improve your site structure.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_link_suggestions"
					data-id="input:wpseo.enable_link_suggestions"
					label={ __( "Link suggestions", "wordpress-seo" ) }
					labelSuffix={ <Badge className="yst-ml-1.5" variant="upsell">Premium</Badge> }
					description={ __( "The link suggestions metabox contains a list of posts on your blog with similar content that might be interesting to link to.", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout title={ __( "Social sharing", "wordpress-seo" ) }>
				<Alert id="alert:social-sharing">
					{ __( "Facebook, Twitter and Pinterest all use Facebook's Open Graph data, so be sure to keep the 'Open Graph data' setting below enabled if you want to optimize your site for these social platforms.", "wordpress-seo" ) }
				</Alert>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo_social.opengraph"
					data-id="input:wpseo_social.opengraph"
					label={ __( "Open Graph data", "wordpress-seo" ) }
					description={ __( "Allows for Facebook and other social media to display a preview with images and a text excerpt when a link to your site is shared.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo_social.twitter"
					data-id="input:wpseo_social.twitter"
					label={ __( "Twitter card data", "wordpress-seo" ) }
					description={ __( "Allows for Twitter to display a preview with images and a text excerpt when a link to your site is shared.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_enhanced_slack_sharing"
					data-id="input:wpseo.enable_enhanced_slack_sharing"
					label={ __( "Slack sharing", "wordpress-seo" ) }
					description={ __( "This adds an author byline and reading time estimate to the article’s snippet when shared on Slack.", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout title={ __( "Tools", "wordpress-seo" ) }>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_admin_bar_menu"
					data-id="input:wpseo.enable_admin_bar_menu"
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
					data-id="input:wpseo.enable_headless_rest_endpoints"
					label={ __( "REST API endpoint", "wordpress-seo" ) }
					description={ __( "This Yoast SEO REST API endpoint gives you all the metadata you need for a specific URL. This will make it very easy for headless WordPress sites to use Yoast SEO for all their SEO meta output.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.enable_xml_sitemap"
					data-id="input:wpseo.enable_xml_sitemap"
					label={ __( "XML sitemaps", "wordpress-seo" ) }
					description={ __( "Enable the XML sitemaps that Yoast SEO generates.", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout title={ __( "Security & privacy", "wordpress-seo" ) }>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.disableadvanced_meta"
					data-id="input:wpseo.disableadvanced_meta"
					label={ __( "Restrict advanced settings for authors", "wordpress-seo" ) }
					description={ __( "By default only editors and administrators can access the Advanced - and Schema section of the Yoast SEO metabox. Disabling this allows access to all users.", "wordpress-seo" ) }
				/>
				<FormikValueChangeField
					as={ ToggleField }
					type="checkbox"
					name="wpseo.tracking"
					data-id="input:wpseo.tracking"
					label={ __( "Usage tracking", "wordpress-seo" ) }
					description={ __( "Usage tracking allows us to track some data about your site to improve our plugin.", "wordpress-seo" ) }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default SitePreferences;

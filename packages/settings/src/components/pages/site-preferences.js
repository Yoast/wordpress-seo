import { __ } from "@wordpress/i18n";
import { Section as PureSection, Alert } from "@yoast/admin-ui-toolkit/components";
import withHideForOptions from "../../helpers/with-hide-for-options";
import Page from "../page";
import Switch from "../switch";

const Section = withHideForOptions()( PureSection );

/**
 * The SitePreferences Page component.
 *
 * @returns {Component} The SitePreferences Page.
 */
export default function SitePreferences() {
	return (
		<Page
			title={ __( "Site preferences", "admin-ui" ) }
			description={ __( "Tell us which features you want to use.", "admin-ui" ) }
		>
			<Section
				title="Copywriting"
				optionPath={ [
					"featureToggles.copyWriting.seoAnalysis",
					"featureToggles.copyWriting.readabilityAnalysis",
					"featureToggles.copyWriting.insights",
				] }
			>
				<Switch
					dataPath="featureToggles.copyWriting.seoAnalysis"
					label={ __( "SEO analysis", "admin-ui" ) }
					description={ __( "The SEO analysis offers suggestions to improve the SEO of your text.", "admin-ui" ) }
				/>
				<Switch
					dataPath="featureToggles.copyWriting.readabilityAnalysis"
					label={ __( "Readability analysis", "admin-ui" ) }
					description={ __( "The readability analysis offers suggestions to improve the structure and style of your text.", "admin-ui" ) }
				/>
				<Switch
					dataPath="featureToggles.copyWriting.insights"
					label={ __( "Insights", "admin-ui" ) }
					description={ __( "The Insights section in our metabox shows you useful data about your content, like what words you use most often.", "admin-ui" ) }
				/>
			</Section>

			<Section
				title="Site structure"
				optionPath={ [
					"featureToggles.siteStructure.cornerstoneContent",
					"featureToggles.siteStructure.linkSuggestions",
					"featureToggles.siteStructure.linkSuggestions",
				] }
			>
				<Switch
					dataPath="featureToggles.siteStructure.cornerstoneContent"
					label={ __( "Cornerstone content", "admin-ui" ) }
					description={ __( "The cornerstone content feature lets you to mark and filter cornerstone content on your website.", "admin-ui" ) }
				/>
				<Switch
					dataPath="featureToggles.siteStructure.textLinkCounter"
					label={ __( "Text link counter", "admin-ui" ) }
					description={ __( "The text link counter helps you improve your site structure.", "admin-ui" ) }
				/>
				<Switch
					dataPath="featureToggles.siteStructure.linkSuggestions"
					label={ __( "Link suggestions", "admin-ui" ) }
					description={ __( "The link suggestions metabox contains a list of posts on your blog with similar content that might be interesting to link to.", "admin-ui" ) }
				/>
			</Section>

			<Section
				title="Social sharing"
				optionPath={ [
					"featureToggles.socialSharing.openGraph",
					"featureToggles.socialSharing.twitter",
					"featureToggles.socialSharing.slackSharing",
				] }
			>
				<Alert type="info">
					<p>{ __( "Facebook, Twitter and Pinterest all use Facebook's Open Graph data, so be sure to keep the 'Open Graph data' " +
						"setting below enabled if you want to optimize your site for these social platforms.", "admin-ui" ) }</p>
				</Alert>
				<Switch
					dataPath="featureToggles.socialSharing.openGraph"
					label={ __( "Open Graph data", "admin-ui" ) }
					description={ __( "Allows for Facebook and other social media to display a preview with images and a text excerpt when a link to your site is shared.", "admin-ui" ) }
				/>
				<Switch
					dataPath="featureToggles.socialSharing.twitter"
					label={ __( "Twitter card data", "admin-ui" ) }
					description={ __( "Allows for Twitter to display a preview with images and a text excerpt when a link to your site is shared.", "admin-ui" ) }
				/>
				<Switch
					dataPath="featureToggles.socialSharing.slackSharing"
					label={ __( "Slack sharing", "admin-ui" ) }
					description={ __( "This adds an author byline and reading time estimate to the article’s snippet when shared on Slack.", "admin-ui" ) }
				/>
			</Section>

			<Section title="Tools" optionPath="featureToggles.tools.adminBarMenu">
				<Switch
					dataPath="featureToggles.tools.adminBarMenu"
					label={ __( "Admin bar menu", "admin-ui" ) }
					description={ __( "The Yoast SEO admin bar menu contains useful links to third-party tools for analyzing pages and makes it easy to see if you have new notifications.", "admin-ui" ) }
				/>
			</Section>

			<Section title="APIs" optionPath={ [ "featureToggles.apis.restApiEndpoint", "featureToggles.apis.xmlSitemaps" ] }>
				<Switch
					dataPath="featureToggles.apis.restApiEndpoint"
					label={ __( "REST API endpoint", "admin-ui" ) }
					description={ __( "This Yoast SEO REST API endpoint gives you all the metadata you need for a specific URL. This will make it very easy for headless WordPress sites to use Yoast SEO for all their SEO meta output.", "admin-ui" ) }
				/>
				<Switch
					dataPath="featureToggles.apis.xmlSitemaps"
					label={ __( "XML sitemaps", "admin-ui" ) }
					description={ __( "Enable the XML sitemaps that Yoast SEO generates.", "admin-ui" ) }
				/>
			</Section>

			<Section
				title="Security & privacy"
				optionPath={ [ "featureToggles.securityPrivacy.restrictAdvancedTab", "featureToggles.securityPrivacy.usageTracking" ] }
			>
				<Switch
					dataPath="featureToggles.securityPrivacy.restrictAdvancedTab"
					label={ __( "Restrict advanced settings for authors", "admin-ui" ) }
					description={ __( "The advanced section of the Yoast SEO meta box allows a user to remove posts from the search results or change the canonical. The settings in the schema tab allows a user to change schema meta data for a post. These are things you might not want any author to do. That's why, by default, only editors and administrators can do this. Setting to \"Off\" allows all users to change these settings.", "admin-ui" ) }
				/>
				<Switch
					dataPath="featureToggles.securityPrivacy.usageTracking"
					label={ __( "Usage tracking", "admin-ui" ) }
					description={ __( "Usage tracking allows us to track some data about your site to improve our plugin.", "admin-ui" ) }
				/>
			</Section>
		</Page>
	);
}

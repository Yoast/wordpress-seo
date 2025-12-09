import { __ } from "@wordpress/i18n";

export const socialSharingFeatures = [
	{
		name: "wpseo_social.opengraph",
		id: "card-wpseo_social-opengraph",
		inputId: "input-wpseo_social-opengraph",
		imageSrc: "/images/icon-open-graph.svg",
		title: __( "Open Graph data", "wordpress-seo" ),
		description: __( "Allows for Facebook and other social media to display a preview with images and a text excerpt when a link to your site is shared. Keep this feature enabled to optimize your site for social media.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/site-features-open-graph-data",
		learnMoreLinkId: "link-open-graph-data",
		learnMoreLinkAriaLabel: __( "Open Graph data", "wordpress-seo" ),
	},
	{
		name: "wpseo_social.twitter",
		id: "card-wpseo_social-twitter",
		inputId: "input-wpseo_social-twitter",
		imageSrc: "/images/icon-x-card-data.svg",
		title: __( "X card data", "wordpress-seo" ),
		description: __( "Allows for X to display a preview with images and a text excerpt when a link to your site is shared.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/site-features-twitter-card-data",
		learnMoreLinkId: "link-twitter-card-data",
		learnMoreLinkAriaLabel: __( "X card data", "wordpress-seo" ),
	},
	{
		name: "wpseo.enable_enhanced_slack_sharing",
		id: "card-wpseo-enable_enhanced_slack_sharing",
		inputId: "input-wpseo-enable_enhanced_slack_sharing",
		imageSrc: "/images/icon-slack-sharing.svg",
		title: __( "Slack sharing", "wordpress-seo" ),
		description: __( "This adds an author byline and reading time estimate to the article’s snippet when shared on Slack.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/help-slack-share",
		learnMoreLinkId: "link-slack-sharing",
		learnMoreLinkAriaLabel: __( "Slack sharing", "wordpress-seo" ),
	},
];

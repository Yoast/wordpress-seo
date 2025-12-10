import { __ } from "@wordpress/i18n";

export const siteStructureFeatures = [
	{
		name: "wpseo.enable_cornerstone_content",
		id: "card-wpseo-enable_cornerstone_content",
		inputId: "input-wpseo-enable_cornerstone_content",
		imageSrc: "/images/icon-cornerstone-content.svg",
		title: __( "Cornerstone content", "wordpress-seo" ),
		description: __( "Mark and filter your cornerstone content to make sure your most important articles get the attention they deserve. To help you write excellent copy, we’ll assess your text more strictly.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/dashboard-help-cornerstone",
		learnMoreLinkId: "link-cornerstone-content",
		learnMoreLinkAriaLabel: __( "Cornerstone content", "wordpress-seo" ),
	},
	{
		name: "wpseo.enable_text_link_counter",
		id: "card-wpseo-enable_text_link_counter",
		inputId: "input-wpseo-enable_text_link_counter",
		imageSrc: "/images/icon-text-link-counter.svg",
		title: __( "Text link counter", "wordpress-seo" ),
		description: __( "Count the number of internal links from and to your posts to improve your site structure.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/2aj",
		learnMoreLinkId: "link-text-link-counter",
		learnMoreLinkAriaLabel: __( "Text link counter", "wordpress-seo" ),
	},
	{
		name: "wpseo.enable_link_suggestions",
		id: "card-wpseo-enable_link_suggestions",
		inputId: "input-wpseo-enable_link_suggestions",
		imageSrc: "/images/icon-internal-linking-suggestions.svg",
		title: __( "Link suggestions", "wordpress-seo" ),
		description: __( "No need to figure out what to link to. You get linking suggestions for relevant posts and pages to make your website easier to navigate.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/dashboard-help-link-suggestions",
		learnMoreLinkId: "link-link-suggestions",
		learnMoreLinkAriaLabel: __( "Link suggestions", "wordpress-seo" ),
		isPremiumFeature: true,
		isPremiumLink: "https://yoa.st/get-link-suggestions",
	},
];

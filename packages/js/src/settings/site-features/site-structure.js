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
		description: __( "Keep track of the number of internal and external text links in your content.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/dashboard-help-text-link-counter",
		learnMoreLinkId: "link-text-link-counter",
		learnMoreLinkAriaLabel: __( "Text link counter", "wordpress-seo" ),
	},
	{
		name: "wpseo.enable_link_suggestions",
		id: "card-wpseo-enable_link_suggestions",
		inputId: "input-wpseo-enable_link_suggestions",
		imageSrc: "/images/icon-link-suggestions.svg",
		title: __( "Link suggestions", "wordpress-seo" ),
		description: __( "Get suggestions for internal links to improve your content structure.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/dashboard-help-link-suggestions",
		learnMoreLinkId: "link-link-suggestions",
		learnMoreLinkAriaLabel: __( "Link suggestions", "wordpress-seo" ),
	},
];

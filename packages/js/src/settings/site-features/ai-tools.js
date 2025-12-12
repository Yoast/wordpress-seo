import { __ } from "@wordpress/i18n";
import { ReactComponent as AIGeneratorIcon } from "../../../../../images/icon-sparkles.svg";
import { ReactComponent as LlmtxtIcon } from "../../../../../images/icon-llms-txt.svg";

export const aiToolsFeatures = [
	{
		name: "wpseo.enable_ai_generator",
		id: "card-wpseo-enable_ai_generator",
		inputId: "input-wpseo-enable_ai_generator",
		Icon: AIGeneratorIcon,
		isPremiumFeature: false,
		title: "Yoast AI",
		description: __( "The AI features help you create better content by providing optimization suggestions that you can apply as you wish.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/ai-generator-feature",
		learnMoreLinkId: "link-ai-generator",
		learnMoreLinkAriaLabel: __( "AI title & description generator", "wordpress-seo" ),
	},
	{
		name: "wpseo.enable_llms_txt",
		id: "card-wpseo-enable_llms_txt",
		inputId: "input-wpseo-enable_llms_txt",
		Icon: LlmtxtIcon,
		isPremiumFeature: false,
		title: __( "llms.txt", "wordpress-seo" ),
		description: __( "Generate a file that points to your website's most relevant content. Designed to help AI Assistants understand your website better.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/site-features-llmstxt-learn-more",
		learnMoreLinkId: "link-llms-txt",
		learnMoreLinkAriaLabel: __( "llms.txt", "wordpress-seo" ),
	},
];

import { __ } from "@wordpress/i18n";
import { ReactComponent as AIGeneratorIcon } from "../../../../../images/icon-sparkles.svg";
import { ReactComponent as LlmtxtIcon } from "../../../../../images/icon-llms-txt.svg";
import { ReactComponent as SchemaAggregationIcon } from "../../../../../images/icon-schema-aggregation-endpoint.svg";

export const aiToolsFeatures = {
	aiGenerator: {
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
	llmsTxt: {
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
	schemaAggregation: {
		name: "wpseo.enable_schema_aggregation_endpoint",
		id: "card-wpseo-enable_schema_aggregation_endpoint",
		inputId: "input-wpseo-enable_schema_aggregation_endpoint",
		Icon: SchemaAggregationIcon,
		isPremiumFeature: false,
		title: __( "Schema aggregation endpoint", "wordpress-seo" ),
		description: __( "Provides everything required to connect with your site's public structured data. This enables conversational interfaces like NLWeb to power natural language queries on your content.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/site-features-schema-aggregation-endpoint-learn-more",
		learnMoreLinkId: "link-schema-aggregation-endpoint",
		learnMoreLinkAriaLabel: __( "Schema aggregation endpoint", "wordpress-seo" ),
	},
};

import { __ } from "@wordpress/i18n";
import { ReactComponent as SEOAnalysisIcon } from "../../../../../images/icon-seo-analysis.svg";
import { ReactComponent as ReadabilityAnalysisIcon } from "../../../../../images/icon-readability-analysis.svg";
import { ReactComponent as InclusiveLanguageAnalysisIcon } from "../../../../../images/icon-inclusive-language-analysis.svg";
import { ReactComponent as InsightsIcon } from "../../../../../images/icon-insights.svg";

export const contentOptimizationFeatures = {
	keywordAnalysis: {
		name: "wpseo.keyword_analysis_active",
		id: "card-wpseo-keyword_analysis_active",
		inputId: "input-wpseo-keyword_analysis_active",
		Icon: SEOAnalysisIcon,
		title: __( "SEO analysis", "wordpress-seo" ),
		description: __( "The SEO analysis offers suggestions to improve the findability of your text and makes sure that your content meets best practices.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/2ak",
		learnMoreLinkId: "link-seo-analysis",
		learnMoreLinkAriaLabel: __( "SEO analysis", "wordpress-seo" ),
	},
	contentAnalysis: {
		name: "wpseo.content_analysis_active",
		id: "card-wpseo-content_analysis_active",
		inputId: "input-wpseo-content_analysis_active",
		Icon: ReadabilityAnalysisIcon,
		title: __( "Readability analysis", "wordpress-seo" ),
		description: __( "The readability analysis offers suggestions to improve the structure and style of your text.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/2ao",
		learnMoreLinkId: "link-readability-analysis",
		learnMoreLinkAriaLabel: __( "Readability analysis", "wordpress-seo" ),
	},
	inclusiveLanguageAnalysis: {
		name: "wpseo.inclusive_language_analysis_active",
		id: "card-wpseo-inclusive_language_analysis_active",
		inputId: "input-wpseo-inclusive_language_analysis_active",
		Icon: InclusiveLanguageAnalysisIcon,
		title: __( "Inclusive language analysis", "wordpress-seo" ),
		description: __( "The inclusive language analysis offers suggestions to write more inclusive copy, so more people will be able to relate to your content.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/inclusive-language-feature-learn-more",
		learnMoreLinkId: "link-inclusive-language-analysis",
		learnMoreLinkAriaLabel: __( "Inclusive language analysis", "wordpress-seo" ),
	},
	insights: {
		name: "wpseo.enable_metabox_insights",
		id: "card-wpseo-enable_metabox_insights",
		inputId: "input-wpseo-enable_metabox_insights",
		Icon: InsightsIcon,
		title: __( "Insights", "wordpress-seo" ),
		description: __( "Get more insights into what you are writing. What words do you use most often? How much time does it take to read your text? Is your text easy to read?", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/4ew",
		learnMoreLinkId: "link-insights",
		learnMoreLinkAriaLabel: __( "Insights", "wordpress-seo" ),
	},
};

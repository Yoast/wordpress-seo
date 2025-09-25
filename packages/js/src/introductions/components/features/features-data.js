import { __ } from "@wordpress/i18n";
import { ReactComponent as  SparklesIcon } from "../../../../images/icon-sparkles.svg";
import { ReactComponent as  RedirectManagerIcon } from "../../../../images/icon-redirect-manager.svg";
import { ReactComponent as  SeoAnalysisIcon } from "../../../../images/icon-seo-analysis.svg";
import { ReactComponent as  DuplicateIcon } from "../../../../images/icon-duplicate.svg";
import { ReactComponent as  OpenGraphIcon } from "../../../../images/icon-open-graph.svg";

export const featuresData = [
	{
		icon: SparklesIcon,
		title: __( "Generate titles & meta descriptions", "wordpress-seo" ),
		description: __( "Take the hassle out of publishing content with ready-made, optimized titles and meta descriptions", "wordpress-seo" ),
	},
	{
		icon: SparklesIcon,
		title: __( "Improve content with AI suggestions", "wordpress-seo" ),
		description: __( "Remove the frustration out of manual SEO tweaks with AI-suggested improvements", "wordpress-seo" ),
	},
	{
		icon: RedirectManagerIcon,
		title: __( "Manage redirects without hassle", "wordpress-seo" ),
		description: __( "Keep your website running properly and prevent losing visitors to broken links", "wordpress-seo" ),
	},
	{
		icon: SeoAnalysisIcon,
		title: __( "Get the SEO Premium Analysis", "wordpress-seo" ),
		description: __( "Optimize content to reach more people, improve search visibility across more queries", "wordpress-seo" ),
	},
	{
		icon: DuplicateIcon,
		title: __( "Easily add internal links", "wordpress-seo" ),
		description: __( "Build relevant internal links faster while strengthening your site’s structure", "wordpress-seo" ),
	},
	{
		icon: OpenGraphIcon,
		title: __( "Ensure content looks good on social", "wordpress-seo" ),
		description: __( "Make every post share-ready as you publish, boosting visibility and clicks from Facebook & X", "wordpress-seo" ),
	},
];

export const perksData = [
	__( "24/7 Premium support via chat & email", "wordpress-seo" ),
	__( "Access to all courses in Yoast SEO Academy", "wordpress-seo" ),
	__( "Free seat for the Google Docs add‑on", "wordpress-seo" ),
	__( "Access to all Yoast plugins", "wordpress-seo" ),
];

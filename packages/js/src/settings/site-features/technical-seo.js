import { __, sprintf } from "@wordpress/i18n";

export const technicalSeoFeatures = [
	{
		name: "wpseo.enable_xml_sitemap",
		id: "card-wpseo-enable_xml_sitemap",
		inputId: "input-wpseo-enable_xml_sitemap",
		imageSrc: "/images/icon-xml-sitemaps.svg",
		title: __( "XML sitemaps", "wordpress-seo" ),
		description: sprintf(
			// translators: %1$s expands to "Yoast SEO".
			__( "Enable the %1$s XML sitemaps. A sitemap is a file that lists a website's essential pages to make sure search engines can find and crawl them.", "wordpress-seo" ),
			"Yoast SEO"
		),
		learnMoreUrl: "https://yoa.st/2al",
		learnMoreLinkId: "link-xml-sitemaps",
		learnMoreLinkAriaLabel: __( "XML sitemaps", "wordpress-seo" ),
	},
	{
		name: "wpseo.enable_headless_rest_endpoints",
		id: "card-wpseo-enable_headless_rest_endpoints",
		inputId: "input-wpseo-enable_headless_rest_endpoints",
		imageSrc: "/images/icon-rest-api-endpoint.svg",
		title: __( "REST API endpoint", "wordpress-seo" ),
		description: __( "Enable the Yoast SEO REST API endpoints to allow headless setups to retrieve SEO data for posts and terms.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/rest-api-endpoints",
		learnMoreLinkId: "link-rest-api-endpoint",
		learnMoreLinkAriaLabel: __( "REST API endpoint", "wordpress-seo" ),
	},
	{
		name: "wpseo.enable_index_now",
		id: "card-wpseo-enable_index_now",
		inputId: "input-wpseo-enable_index_now",
		imageSrc: "/images/icon-index-now.svg",
		isPremiumFeature: true,
		isPremiumLink: "https://yoa.st/get-indexnow",
		title: __( "IndexNow", "wordpress-seo" ),
		description: __( "Automatically ping search engines like Bing and Yandex whenever you publish, update or delete a post.", "wordpress-seo" ),
	},
];

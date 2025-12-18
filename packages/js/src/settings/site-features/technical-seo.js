import { __, sprintf } from "@wordpress/i18n";
import { ReactComponent as XMLSitemapsIcon } from "../../../../../images/icon-xml-sitemaps.svg";
import { ReactComponent as RestApiEndpointIcon } from "../../../../../images/icon-rest-api-endpoint.svg";
import { ReactComponent as IndexNowIcon } from "../../../../../images/icon-index-now.svg";
import { ReactComponent as SchemaFrameworkIcon } from "../../../../../images/icon-schema-framework.svg";

export const technicalSeoFeatures = {
	schemaFramework: {
		name: "wpseo.enable_schema",
		id: "card-wpseo-enable_schema",
		inputId: "input-wpseo-enable_schema",
		Icon: SchemaFrameworkIcon,
		title: __( "Schema Framework", "wordpress-seo" ),
		description: __( "Outputs a single graph the web can understand. Makes every person, product, organization, and piece of content consistently readable to search engines and language models.", "wordpress-seo" ),
		learnMoreLinkId: "link-schema-framework",
		learnMoreUrl: "https://yoa.st/site-features-schema-framework",
		learnMoreLinkAriaLabel: __( "Schema Framework", "wordpress-seo" ),
	},
	xmlSitemaps: {
		name: "wpseo.enable_xml_sitemap",
		id: "card-wpseo-enable_xml_sitemap",
		inputId: "input-wpseo-enable_xml_sitemap",
		Icon: XMLSitemapsIcon,
		title: __( "XML sitemaps", "wordpress-seo" ),
		description: sprintf(
			// translators: %1$s expands to "Yoast SEO".
			__( "Enable the %1$s XML sitemaps. A sitemap is a file that lists a website's essential pages to make sure search engines can find and crawl them.", "wordpress-seo" ),
			"Yoast SEO"
		),
		learnMoreUrl: "https://yoa.st/2a-",
		learnMoreLinkId: "link-xml-sitemaps",
		learnMoreLinkAriaLabel: __( "XML sitemaps", "wordpress-seo" ),
	},
	restApiEndpoint: {
		name: "wpseo.enable_headless_rest_endpoints",
		id: "card-wpseo-enable_headless_rest_endpoints",
		inputId: "input-wpseo-enable_headless_rest_endpoints",
		Icon: RestApiEndpointIcon,
		title: __( "REST API endpoint", "wordpress-seo" ),
		description: __( "This Yoast SEO REST API endpoint gives you all the metadata you need for a specific URL. This will make it very easy for headless WordPress sites to use Yoast SEO for all their SEO meta output.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/site-features-rest-api-endpoint",
		learnMoreLinkId: "link-rest-api-endpoint",
		learnMoreLinkAriaLabel: __( "REST API endpoint", "wordpress-seo" ),
	},
	indexNow: {
		name: "wpseo.enable_index_now",
		id: "card-wpseo-enable_index_now",
		inputId: "input-wpseo-enable_index_now",
		Icon: IndexNowIcon,
		isPremiumFeature: true,
		isPremiumLink: "https://yoa.st/get-indexnow",
		title: __( "IndexNow", "wordpress-seo" ),
		description: __( "Automatically ping search engines like Bing and Yandex whenever you publish, update or delete a post.", "wordpress-seo" ),
		learnMoreUrl: "https://yoa.st/index-now-feature",
		learnMoreLinkId: "link-index-now",
		learnMoreLinkAriaLabel: __( "IndexNow", "wordpress-seo" ),
	},
};

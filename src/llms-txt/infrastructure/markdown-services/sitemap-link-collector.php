<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Infrastructure\Markdown_Services;

use WPSEO_Options;
use WPSEO_Sitemaps_Router;
use Yoast\WP\SEO\Llms_Txt\Domain\Markdown\Items\Link;

/**
 * The sitemap link collector.
 */
class Sitemap_Link_Collector {

	/**
	 * Gets the link for the sitemap.
	 *
	 * @return Link The link for the sitemap.
	 */
	public function get_link(): ?Link {
		$sitemap_url = null;

		if ( WPSEO_Options::get( 'enable_xml_sitemap' ) ) {
			$sitemap_url = WPSEO_Sitemaps_Router::get_base_url( 'sitemap_index.xml' );
		}
		else {
			$core_sitemap_url = \get_sitemap_url( 'index' );
			if ( $core_sitemap_url !== false ) {
				$sitemap_url = $core_sitemap_url;
			}
		}

		/**
		 * Filter: 'wpseo_llmstxt_sitemap_url' - Allows filtering the sitemap URL used in the llms.txt file,
		 * for example to point to a third-party sitemap plugin's URL.
		 *
		 * @since 28.2
		 *
		 * @param string|null $sitemap_url The sitemap URL as resolved by Yoast SEO, or null if none was found.
		 */
		$sitemap_url = \apply_filters( 'wpseo_llmstxt_sitemap_url', $sitemap_url );

		if ( empty( $sitemap_url ) ) {
			return null;
		}

		return new Link( 'Sitemap index', $sitemap_url );
	}
}

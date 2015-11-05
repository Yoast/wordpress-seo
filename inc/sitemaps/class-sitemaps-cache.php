<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Handles sitemaps caching and invalidation.
 */
class WPSEO_Sitemaps_Cache {

	/**
	 * If cache is enabled.
	 *
	 * @return boolean
	 */
	public function is_enabled() {

		/**
		 * Filter: 'wpseo_enable_xml_sitemap_transient_caching' - Allow disabling the transient cache
		 *
		 * @api bool $unsigned Enable cache or not, defaults to true
		 */
		return apply_filters( 'wpseo_enable_xml_sitemap_transient_caching', true );
	}

	/**
	 * Retrieve the sitemap page from cache.
	 *
	 * @param string $type Sitemap type.
	 * @param int    $page Page number to retrieve.
	 *
	 * @return string|boolean
	 */
	public function get_sitemap( $type, $page ) {

		return get_transient( 'wpseo_sitemap_cache_' . $type . '_' . $page );
	}

	/**
	 * Store the sitemap page from cache.
	 *
	 * @param string $type    Sitemap type.
	 * @param int    $page    Page number to store.
	 * @param string $sitemap Sitemap body to store.
	 *
	 * @return bool
	 */
	public function store_sitemap( $type, $page, $sitemap ) {

		return set_transient( 'wpseo_sitemap_cache_' . $type . '_' . $page, $sitemap, DAY_IN_SECONDS );
	}
}

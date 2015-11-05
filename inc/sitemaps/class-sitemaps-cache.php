<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Handles sitemaps caching and invalidation.
 */
class WPSEO_Sitemaps_Cache {

	/**
	 * Hook methods for invalidation on necessary events.
	 */
	public function __construct() {

		add_action( 'deleted_term_relationships', array( __CLASS__, 'invalidate' ) );
	}

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

	/**
	 * Delete cache transients for index and specific type.
	 *
	 * Always deletes the main index sitemaps cache, as that's always invalidated by any other change.
	 *
	 * @param string $type Sitemap type to invalidate.
	 *
	 * @return string|boolean Query result.
	 */
	static public function invalidate( $type ) {

		delete_transient( 'wpseo_sitemap_cache_1' );
		delete_transient( 'wpseo_sitemap_cache_' . $type );

		return self::clear( array( $type ) );
	}

	/**
	 * Delete cache transients for given sitemaps types or all by default.
	 *
	 * @param array $types Set of sitemap types to delete cache transients for.
	 *
	 * @return int|boolean Query result.
	 */
	static public function clear( $types = array() ) {

		global $wpdb;

		if ( wp_using_ext_object_cache() ) {
			return false;
		}

		if ( ! apply_filters( 'wpseo_enable_xml_sitemap_transient_caching', true ) ) {
			return false;
		}

		// Not sure about efficiency, but that's what code elsewhere does R.
		$options = WPSEO_Options::get_all();

		if ( true !== $options['enablexmlsitemap'] ) {
			return false;
		}

		$query = "DELETE FROM $wpdb->options WHERE";

		if ( ! empty( $types ) ) {

			$first = true;

			foreach ( $types as $sitemap_type ) {

				if ( ! $first ) {
					$query .= ' OR ';
				}

				$query .= " option_name LIKE '_transient_wpseo_sitemap_cache_" . $sitemap_type . "_%' OR option_name LIKE '_transient_timeout_wpseo_sitemap_cache_" . $sitemap_type . "_%'";

				$first = false;
			}
		}
		else {
			$query .= " option_name LIKE '_transient_wpseo_sitemap_%' OR option_name LIKE '_transient_timeout_wpseo_sitemap_%'";
		}

		return $wpdb->query( $query );
	}
}

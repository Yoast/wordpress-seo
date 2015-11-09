<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Handles sitemaps caching and invalidation.
 */
class WPSEO_Sitemaps_Cache {

	/** @var array $cache_clear Holds the options that, when updated, should cause the cache to clear. */
	protected static $cache_clear = array();

	/**
	 * Hook methods for invalidation on necessary events.
	 */
	public function __construct() {

		add_action( 'deleted_term_relationships', array( __CLASS__, 'invalidate' ) );

		add_action( 'edited_terms', array( __CLASS__, 'invalidate_helper' ), 10, 2 );
		add_action( 'clean_term_cache', array( __CLASS__, 'invalidate_helper' ), 10, 2 );
		add_action( 'clean_object_term_cache', array( __CLASS__, 'invalidate_helper' ), 10, 2 );

		add_action( 'save_post', array( __CLASS__, 'invalidate_post' ) );
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
	 * Helper to invalidate in hooks where type is passed as second argument.
	 *
	 * @param int    $unused Unused term ID value.
	 * @param string $type   Taxonomy to invalidate.
	 *
	 * @return bool|string Query result.
	 */
	static public function invalidate_helper( $unused, $type ) {
		return self::invalidate( $type );
	}

	/**
	 * Invalidate sitemap cache for the post type of a post.
	 *
	 * Don't invalidate for revisions.
	 *
	 * @param int $post_id Post ID to invalidate type for.
	 *
	 * @return int|boolean Query result.
	 */
	static public function invalidate_post( $post_id ) {

		if ( wp_is_post_revision( $post_id ) ) {
			return false;
		}

		return self::invalidate( get_post_type( $post_id ) );
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

	/**
	 * Adds a hook that when given option is updated, the cache is cleared
	 *
	 * @param string $option Option name.
	 * @param string $type   Sitemap type.
	 */
	public static function register_clear_on_option_update( $option, $type = '' ) {

		self::$cache_clear[ $option ] = $type;
		add_action( 'update_option', array( __CLASS__, 'clear_on_option_update' ) );
	}

	/**
	 * Clears the transient cache when a given option is updated, if that option has been registered before
	 *
	 * @param string $option The option name that's being updated.
	 *
	 * @return string|bool Query result.
	 */
	public static function clear_on_option_update( $option ) {

		if ( ! empty( self::$cache_clear[ $option ] ) ) {
			return WPSEO_Sitemaps_Cache::invalidate( self::$cache_clear[ $option ] );
		}

		return WPSEO_Sitemaps_Cache::clear();
	}
}

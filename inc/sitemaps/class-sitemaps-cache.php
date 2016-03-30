<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Handles sitemaps caching and invalidation.
 */
class WPSEO_Sitemaps_Cache {

	/** @var string Prefix of the transient key for sitemap caches */
	const STORAGE_KEY_PREFIX = 'yst_sm_';

	/** @var array $cache_clear Holds the options that, when updated, should cause the cache to clear. */
	protected static $cache_clear = array();

	/**
	 * Hook methods for invalidation on necessary events.
	 */
	public function __construct() {

		add_action( 'deleted_term_relationships', array( __CLASS__, 'invalidate' ) );

		add_action( 'update_option', array( __CLASS__, 'clear_on_option_update' ) );

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
		 * Filter if XML sitemap transient cache is enabled.
		 *
		 * @param bool $unsigned Enable cache or not, defaults to true
		 */
		return apply_filters( 'wpseo_enable_xml_sitemap_transient_caching', true );
	}

	/**
	 * If the type is over length make sure we compact it so we don't have any database problems
	 *
	 * When there are more 'extremely long' post types, changes are they have variations in either the start or ending.
	 * Because of this, we cut out the excess in the middle which should result in less chance of collision.
	 *
	 * @param string $type    The type of sitemap to be used.
	 * @param string $prefix  The part before the type in the cache key. Only the length is used.
	 * @param string $postfix The part after the type in the cache key. Only the length is used.
	 *
	 * @return string The type with a safe length to use
	 *
	 * @throws OutOfRangeException When there is less than 15 characters of space for a key that is originally longer.
	 */
	public static function truncate_type( $type, $prefix = '', $postfix = '' ) {
		/**
		 * This length has been restricted by the database column length of 64 in the past.
		 * The prefix added by WordPress is '_transient_' because we are saving to a transient.
		 * We need to use a timeout on the transient, otherwise the values get autoloaded, this adds
		 * another restriction to the length.
		 */
		$max_length = 45; // 64 - 19 ('_transient_timeout_')
		$max_length -= strlen( $prefix );
		$max_length -= strlen( $postfix );

		if ( strlen( $type ) > $max_length ) {

			if ( $max_length < 15 ) {
				/**
				 * If this happens the most likely cause is a page number that is too high.
				 *
				 * So this would not happen unintentionally..
				 * Either by trying to cause a high server load, finding backdoors or misconfiguration.
				 */
				throw new OutOfRangeException(
					__(
						'Trying to build truncate the sitemap cache key, but the postfix and prefix combination leaves too little room to do this. You are probably requesting a page that is way out of the expected range.',
						'wordpress-seo'
					)
				);
			}

			$half = ( $max_length / 2 );

			$first_part = substr( $type, 0, ( ceil( $half ) - 1 ) );
			$last_part  = substr( $type, ( 1 - floor( $half ) ) );

			$type = $first_part . '..' . $last_part;
		}

		return $type;
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

		$transient_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );
		if ( false === $transient_key ) {
			return false;
		}

		return get_transient( $transient_key );
	}

	/**
	 * Get the sitemap that is cached
	 *
	 * @param string $type Sitemap type.
	 * @param int    $page Page number to retrieve.
	 *
	 * @return null|WPSEO_Sitemap_Cache_Data Null on no cache found otherwise object containing sitemap and meta data.
	 */
	public function get_sitemap_data( $type, $page ) {

		$sitemap = $this->get_sitemap( $type, $page );

		if ( empty( $sitemap ) ) {
			return null;
		}

		// Unserialize Cache Data object (is_serialized doesn't recognize classes).
		if ( is_string( $sitemap ) && 0 === strpos( $sitemap, 'C:24:"WPSEO_Sitemap_Cache_Data"' ) ) {

			$sitemap = unserialize( $sitemap );
		}

		// What we expect it to be if it is set.
		if ( $sitemap instanceof WPSEO_Sitemap_Cache_Data_Interface ) {
			return $sitemap;
		}

		return null;
	}

	/**
	 * Store the sitemap page from cache.
	 *
	 * @param string $type    Sitemap type.
	 * @param int    $page    Page number to store.
	 * @param string $sitemap Sitemap body to store.
	 * @param bool   $usable  Is this a valid sitemap or a cache of an invalid sitemap.
	 *
	 * @return bool
	 */
	public function store_sitemap( $type, $page, $sitemap, $usable = true ) {

		$transient_key = WPSEO_Sitemaps_Cache_Validator::get_storage_key( $type, $page );

		if ( false === $transient_key ) {
			return false;
		}

		$status = ( $usable ) ? WPSEO_Sitemap_Cache_Data::OK : WPSEO_Sitemap_Cache_Data::ERROR;

		$sitemap_data = new WPSEO_Sitemap_Cache_Data();
		$sitemap_data->set_sitemap( $sitemap );
		$sitemap_data->set_status( $status );

		return set_transient( $transient_key, $sitemap_data, DAY_IN_SECONDS );
	}

	/**
	 * Delete cache transients for index and specific type.
	 *
	 * Always deletes the main index sitemaps cache, as that's always invalidated by any other change.
	 *
	 * @param string $type Sitemap type to invalidate.
	 *
	 * @return void
	 */
	public static function invalidate( $type ) {

		self::clear( array( $type ) );
	}

	/**
	 * Helper to invalidate in hooks where type is passed as second argument.
	 *
	 * @param int    $unused Unused term ID value.
	 * @param string $type   Taxonomy to invalidate.
	 *
	 * @return void
	 */
	public static function invalidate_helper( $unused, $type ) {

		self::invalidate( $type );
	}

	/**
	 * Invalidate sitemap cache for the post type of a post.
	 *
	 * Don't invalidate for revisions.
	 *
	 * @param int $post_id Post ID to invalidate type for.
	 *
	 * @return void
	 */
	public static function invalidate_post( $post_id ) {

		if ( wp_is_post_revision( $post_id ) ) {
			return;
		}

		self::invalidate( get_post_type( $post_id ) );
	}

	/**
	 * Delete cache transients for given sitemaps types or all by default.
	 *
	 * @param array $types Set of sitemap types to delete cache transients for.
	 *
	 * @return void
	 */
	public static function clear( $types = array() ) {

		// No types provided, clear all.
		if ( empty( $types ) ) {
			WPSEO_Sitemaps_Cache_Validator::invalidate_storage();

			return;
		}

		// Always invalidate the index sitemap as well.
		if ( ! in_array( WPSEO_Sitemaps::SITEMAP_INDEX_TYPE, $types ) ) {
			array_unshift( $types, WPSEO_Sitemaps::SITEMAP_INDEX_TYPE );
		}

		foreach ( $types as $type ) {
			WPSEO_Sitemaps_Cache_Validator::invalidate_storage( $type );
		}
	}

	/**
	 * Cleanup invalidated database cache
	 *
	 * @param null|string $type      The type of sitemap to clear cache for.
	 * @param null|string $validator The validator to clear cache of.
	 *
	 * @return void
	 */
	public static function cleanup_database( $type = null, $validator = null ) {

		global $wpdb;

		if ( is_null( $type ) ) {
			// Clear all cache if no type is provided.
			$like = sprintf( '%s%%', self::STORAGE_KEY_PREFIX );
		}
		else {
			if ( ! is_null( $validator ) ) {
				// Clear all cache for provided type-validator.
				$like = sprintf( '%%_%s', $validator );
			}
			else {
				// Clear type cache for all type keys.
				$like = sprintf( '%1$s%2$s_%%', self::STORAGE_KEY_PREFIX, $type );
			}
		}

		/**
		 * Add slashes to the LIKE "_" single character wildcard.
		 *
		 * We can't use `esc_like` here because we need the % in the query.
		 */
		$where   = array();
		$where[] = sprintf( "option_name LIKE '%s'", addcslashes( '_transient_' . $like, '_' ) );
		$where[] = sprintf( "option_name LIKE '%s'", addcslashes( '_transient_timeout_' . $like, '_' ) );

		// Delete transients.
		$query = sprintf( 'DELETE FROM %1$s WHERE %2$s', $wpdb->options, implode( ' OR ', $where ) );
		$wpdb->query( $query );
	}

	/**
	 * Adds a hook that when given option is updated, the cache is cleared
	 *
	 * @param string $option Option name.
	 * @param string $type   Sitemap type.
	 */
	public static function register_clear_on_option_update( $option, $type = '' ) {

		self::$cache_clear[ $option ] = $type;
	}

	/**
	 * Clears the transient cache when a given option is updated, if that option has been registered before
	 *
	 * @param string $option The option name that's being updated.
	 *
	 * @return void
	 */
	public static function clear_on_option_update( $option ) {

		if ( array_key_exists( $option, self::$cache_clear ) ) {

			if ( empty( self::$cache_clear[ $option ] ) ) {
				// Clear all caches.
				self::clear();
			}
			else {
				// Clear specific provided type(s).
				$types = (array) self::$cache_clear[ $option ];
				self::clear( $types );
			}
		}
	}
}

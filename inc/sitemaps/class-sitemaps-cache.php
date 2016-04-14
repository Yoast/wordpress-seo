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

		add_action( 'update_option', array( __CLASS__, 'clear_on_option_update' ) );

		add_action( 'edited_terms', array( __CLASS__, 'invalidate_helper' ), 10, 2 );
		add_action( 'clean_term_cache', array( __CLASS__, 'invalidate_helper' ), 10, 2 );
		add_action( 'clean_object_term_cache', array( __CLASS__, 'invalidate_helper' ), 10, 2 );

		add_action( 'save_post', array( __CLASS__, 'invalidate_post' ) );

		add_action( 'user_register', array( __CLASS__, 'invalidate_user' ) );
		add_action( 'delete_user', array( __CLASS__, 'invalidate_user' ) );
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
	 * Invalidate sitemap cache for authors.
	 *
	 * @param int $user_id User ID.
	 */
	public static function invalidate_author( $user_id ) {

		$user = get_user_by( 'id', $user_id );

		if ( ! in_array( 'subscriber', $user->roles ) ) {
			self::invalidate( 'author' );
		}
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

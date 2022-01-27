<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

// phpcs:disable Generic.CodeAnalysis.UnusedFunctionParameter

/**
 * Handles sitemaps caching and invalidation.
 *
 * @since      3.2
 * @deprecated 18.1 Sitemap caching is removed in favor of indexables. This file now purely exists to prevent fatal errors.
 */
class WPSEO_Sitemaps_Cache {

	/**
	 * Setup context for static calls.
	 *
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public function init() {
		_deprecated_function( __METHOD__, '18.1' );
	}

	/**
	 * If cache is enabled.
	 *
	 * @return bool
	 * @since      3.2
	 *
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public function is_enabled() {
		_deprecated_function( __METHOD__, '18.1' );

		return false;
	}

	/**
	 * Retrieve the sitemap page from cache.
	 *
	 * @param string $type Sitemap type.
	 * @param int    $page Page number to retrieve.
	 *
	 * @return string|bool
	 * @since 3.2
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public function get_sitemap( $type, $page ) {
		_deprecated_function( __METHOD__, '18.1' );

		return false;
	}

	/**
	 * Get the sitemap that is cached.
	 *
	 * @param string $type Sitemap type.
	 * @param int    $page Page number to retrieve.
	 *
	 * @return WPSEO_Sitemap_Cache_Data|null Null on no cache found otherwise object containing sitemap and meta data.
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public function get_sitemap_data( $type, $page ) {
		_deprecated_function( __METHOD__, '18.1' );

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
	 * @since 3.2
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public function store_sitemap( $type, $page, $sitemap, $usable = true ) {
		_deprecated_function( __METHOD__, '18.1' );

		return false;
	}

	/**
	 * Delete cache transients for index and specific type.
	 *
	 * Always deletes the main index sitemaps cache, as that's always invalidated by any other change.
	 *
	 * @param string $type Sitemap type to invalidate.
	 *
	 * @return void
	 * @since 1.5.4
	 * @since 3.2   Changed from function wpseo_invalidate_sitemap_cache() to method in this class.
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public static function invalidate( $type ) {
		_deprecated_function( __METHOD__, '18.1' );
	}

	/**
	 * Helper to invalidate in hooks where type is passed as second argument.
	 *
	 * @param int    $unused Unused term ID value.
	 * @param string $type   Taxonomy to invalidate.
	 *
	 * @return void
	 * @since 3.2
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public static function invalidate_helper( $unused, $type ) {
		_deprecated_function( __METHOD__, '18.1' );
	}

	/**
	 * Invalidate sitemap cache for authors.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return bool True if the sitemap was properly invalidated. False otherwise.
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public static function invalidate_author( $user_id ) {
		_deprecated_function( __METHOD__, '18.1' );

		return false;
	}

	/**
	 * Invalidate sitemap cache for the post type of a post.
	 *
	 * Don't invalidate for revisions.
	 *
	 * @param int $post_id Post ID to invalidate type for.
	 *
	 * @return void
	 * @since 1.5.4
	 * @since 3.2   Changed from function wpseo_invalidate_sitemap_cache_on_save_post() to method in this class.
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public static function invalidate_post( $post_id ) {
		_deprecated_function( __METHOD__, '18.1' );
	}

	/**
	 * Delete cache transients for given sitemaps types or all by default.
	 *
	 * @param array $types Set of sitemap types to delete cache transients for.
	 *
	 * @return void
	 * @since 1.8.0
	 * @since 3.2   Moved from WPSEO_Utils to this class.
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public static function clear( $types = [] ) {
		_deprecated_function( __METHOD__, '18.1' );
	}

	/**
	 * Invalidate storage for cache types queued to clear.
	 *
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public static function clear_queued() {
		_deprecated_function( __METHOD__, '18.1' );
	}

	/**
	 * Adds a hook that when given option is updated, the cache is cleared.
	 *
	 * @param string $option Option name.
	 * @param string $type   Sitemap type.
	 *
	 * @since 3.2
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public static function register_clear_on_option_update( $option, $type = '' ) {
		_deprecated_function( __METHOD__, '18.1' );
	}

	/**
	 * Clears the transient cache when a given option is updated, if that option has been registered before.
	 *
	 * @param string $option The option name that's being updated.
	 *
	 * @return void
	 * @since 3.2
	 * @deprecated 18.1
	 * @codeCoverageIgnore
	 */
	public static function clear_on_option_update( $option ) {
		_deprecated_function( __METHOD__, '18.1' );
	}
}
// phpcs:enable

<?php
/**
 * @package WPSEO\Deprecated
 */

/**
 * This invalidates our XML Sitemaps cache.
 *
 * @since      1.5.4
 * @deprecated 3.2
 * @deprecated use WPSEO_Sitemaps_Cache::invalidate()
 * @see        WPSEO_Sitemaps_Cache::invalidate()
 *
 * @param string $type Type of sitemap to invalidate.
 */
function wpseo_invalidate_sitemap_cache( $type ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 3.2.0', 'WPSEO_Sitemaps_Cache::invalidate()' );

	WPSEO_Sitemaps_Cache::invalidate( $type );
}

/**
 * Invalidate XML sitemap cache for taxonomy / term actions
 *
 * @since      1.5.4
 * @deprecated 3.2
 * @deprecated use WPSEO_Sitemaps_Cache::invalidate()
 * @see        WPSEO_Sitemaps_Cache::invalidate()
 *
 * @param int    $unused Unused term ID value.
 * @param string $type   Taxonomy to invalidate.
 */
function wpseo_invalidate_sitemap_cache_terms( $unused, $type ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 3.2.0', 'WPSEO_Sitemaps_Cache::invalidate()' );

	WPSEO_Sitemaps_Cache::invalidate( $type );
}

/**
 * Invalidate the XML sitemap cache for a post type when publishing or updating a post
 *
 * @since      1.5.4
 * @deprecated 3.2
 * @deprecated use WPSEO_Sitemaps_Cache::invalidate_post()
 * @see        WPSEO_Sitemaps_Cache::invalidate_post()
 *
 * @param int $post_id Post ID to determine post type for invalidation.
 */
function wpseo_invalidate_sitemap_cache_on_save_post( $post_id ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 3.2.0', 'WPSEO_Sitemaps_Cache::invalidate_post()' );

	WPSEO_Sitemaps_Cache::invalidate_post( $post_id );
}

/**
 * Notify search engines of the updated sitemap.
 *
 * @deprecated 3.2
 * @deprecated use WPSEO_Sitemaps::ping_search_engines()
 * @see        WPSEO_Sitemaps::ping_search_engines()
 *
 * @param string|null $sitemapurl Optional URL to make the ping for.
 */
function wpseo_ping_search_engines( $sitemapurl = null ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 3.2.0', 'WPSEO_Sitemaps::ping_search_engines()' );

	WPSEO_Sitemaps::ping_search_engines( $sitemapurl );
}

/**
 * Create base URL for the sitemaps and applies filters
 *
 * @since 1.5.7
 *
 * @deprecated 3.2
 * @deprecated use WPSEO_Sitemaps_Router::get_base_url()
 * @see        WPSEO_Sitemaps_Router::get_base_url()
 *
 * @param string $page page to append to the base URL.
 *
 * @return string base URL (incl page) for the sitemaps
 */
function wpseo_xml_sitemaps_base_url( $page ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 3.2.0', 'WPSEO_Sitemaps_Router::get_base_url()' );

	return WPSEO_Sitemaps_Router::get_base_url( $page );
}

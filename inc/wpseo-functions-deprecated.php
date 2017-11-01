<?php
/**
 * @package WPSEO\Deprecated
 */

/**
 * Get the value from the post custom values.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Meta::get_value()
 * @see        WPSEO_Meta::get_value()
 *
 * @param    string $val    Internal name of the value to get.
 * @param    int    $postid Post ID of the post to get the value for.
 *
 * @return    string
 */
function wpseo_get_value( $val, $postid = 0 ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Meta::get_value()' );

	return WPSEO_Meta::get_value( $val, $postid );
}

/**
 * Save a custom meta value.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Meta::set_value() or just use update_post_meta()
 * @see        WPSEO_Meta::set_value()
 *
 * @param    string $meta_key   The meta to change.
 * @param    mixed  $meta_value The value to set the meta to.
 * @param    int    $post_id    The ID of the post to change the meta for.
 *
 * @return    bool    whether the value was changed
 */
function wpseo_set_value( $meta_key, $meta_value, $post_id ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Meta::set_value()' );

	return WPSEO_Meta::set_value( $meta_key, $meta_value, $post_id );
}

/**
 * Retrieve an array of all the options the plugin uses. It can't use only one due to limitations of the options API.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Options::get_option_names()
 * @see        WPSEO_Options::get_option_names()
 *
 * @return array of options.
 */
function get_wpseo_options_arr() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::get_option_names()' );

	return WPSEO_Options::get_option_names();
}

/**
 * Retrieve all the options for the SEO plugin in one go.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Options::get_all()
 * @see        WPSEO_Options::get_all()
 *
 * @return array Array of options.
 */
function get_wpseo_options() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Options::get_all()' );

	return WPSEO_Options::get_all();
}

/**
 * Used for imports, both in dashboard and import settings pages, this functions either copies
 * $old_metakey into $new_metakey or just plain replaces $old_metakey with $new_metakey.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Meta::replace_meta()
 * @see        WPSEO_Meta::replace_meta()
 *
 * @param string $old_metakey The old name of the meta value.
 * @param string $new_metakey The new name of the meta value, usually the Yoast SEO name.
 * @param bool   $replace     Whether to replace or to copy the values.
 */
function replace_meta( $old_metakey, $new_metakey, $replace = false ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Meta::replace_meta()' );
	WPSEO_Meta::replace_meta( $old_metakey, $new_metakey, $replace );
}

/**
 * Retrieve a taxonomy term's meta value.
 *
 * @deprecated 1.5.0
 * @deprecated use WPSEO_Taxonomy_Meta::get_term_meta()
 * @see        WPSEO_Taxonomy_Meta::get_term_meta()
 *
 * @param string|object $term     Term to get the meta value for.
 * @param string        $taxonomy Name of the taxonomy to which the term is attached.
 * @param string        $meta     Meta value to get.
 *
 * @return bool|mixed value when the meta exists, false when it does not
 */
function wpseo_get_term_meta( $term, $taxonomy, $meta ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.0', 'WPSEO_Taxonomy_Meta::get_term_meta()' );
	return WPSEO_Taxonomy_Meta::get_term_meta( $term, $taxonomy, $meta );
}

/**
 * Throw a notice about an invalid custom taxonomy used.
 *
 * @since      1.4.14
 * @deprecated 1.5.4 (removed)
 */
function wpseo_invalid_custom_taxonomy() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.4' );
}

/**
 * Retrieve a post's terms, comma delimited.
 *
 * @deprecated 1.5.4
 * @deprecated use WPSEO_Replace_Vars::get_terms()
 * @see        WPSEO_Replace_Vars::get_terms()
 *
 * @param int    $id            ID of the post to get the terms for.
 * @param string $taxonomy      The taxonomy to get the terms for this post from.
 * @param bool   $return_single If true, return the first term.
 *
 * @return string Either a single term or a comma delimited string of terms.
 */
function wpseo_get_terms( $id, $taxonomy, $return_single = false ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.4', 'WPSEO_Replace_Vars::get_terms()' );
	$replacer = new WPSEO_Replace_Vars();

	return $replacer->get_terms( $id, $taxonomy, $return_single );
}

/**
 * Generate an HTML sitemap.
 *
 * @deprecated 1.5.5.4
 * @deprecated use plugin Yoast SEO Premium
 * @see        Yoast SEO Premium
 *
 * @param array $atts The attributes passed to the shortcode.
 *
 * @return string
 */
function wpseo_sitemap_handler( $atts ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.5.5.4', 'Functionality has been discontinued after being in beta, it\'ll be available in the Yoast SEO Premium plugin soon.' );

	return '';
}

add_shortcode( 'wpseo_sitemap', 'wpseo_sitemap_handler' );

/**
 * Strip out the shortcodes with a filthy regex, because people don't properly register their shortcodes.
 *
 * @deprecated 1.6.1
 * @deprecated use WPSEO_Utils::strip_shortcode()
 * @see        WPSEO_Utils::strip_shortcode()
 *
 * @param string $text Input string that might contain shortcodes.
 *
 * @return string $text String without shortcodes.
 */
function wpseo_strip_shortcode( $text ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.6.1', 'WPSEO_Utils::strip_shortcode()' );

	return WPSEO_Utils::strip_shortcode( $text );
}

/**
 * Do simple reliable math calculations without the risk of wrong results.
 *
 * @see        http://floating-point-gui.de/
 * @see        The big red warning on http://php.net/language.types.float.php .
 *
 * @deprecated 1.6.1
 * @deprecated use WPSEO_Utils::calc()
 * @see        WPSEO_Utils::calc()
 *
 * In the rare case that the bcmath extension would not be loaded, it will return the normal calculation results.
 *
 * @since      1.5.0
 *
 * @param    mixed  $number1   Scalar (string/int/float/bool).
 * @param    string $action    Calculation action to execute.
 * @param    mixed  $number2   Scalar (string/int/float/bool).
 * @param    bool   $round     Whether or not to round the result. Defaults to false.
 * @param    int    $decimals  Decimals for rounding operation. Defaults to 0.
 * @param    int    $precision Calculation precision. Defaults to 10.
 *
 * @return    mixed                Calculation Result or false if either or the numbers isn't scalar or
 *                                an invalid operation was passed.
 */
function wpseo_calc( $number1, $action, $number2, $round = false, $decimals = 0, $precision = 10 ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.6.1', 'WPSEO_Utils::calc()' );

	return WPSEO_Utils::calc( $number1, $action, $number2, $round, $decimals, $precision );
}

/**
 * Check if the web server is running on Apache.
 *
 * @deprecated 1.6.1
 * @deprecated use WPSEO_Utils::is_apache()
 * @see        WPSEO_Utils::is_apache()
 *
 * @return bool
 */
function wpseo_is_apache() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.6.1', 'WPSEO_Utils::is_apache()' );

	return WPSEO_Utils::is_apache();
}

/**
 * Check if the web service is running on Nginx.
 *
 * @deprecated 1.6.1
 * @deprecated use WPSEO_Utils::is_nginx()
 * @see        WPSEO_Utils::is_nginx()
 *
 * @return bool
 */
function wpseo_is_nginx() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.6.1', 'WPSEO_Utils::is_nginx()' );

	return WPSEO_Utils::is_nginx();
}

/**
 * List all the available user roles
 *
 * @deprecated 1.6.1
 * @deprecated use WPSEO_Utils::get_roles()
 * @see        WPSEO_Utils::get_roles()
 *
 * @return array $roles
 */
function wpseo_get_roles() {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.6.1', 'WPSEO_Utils::get_roles()' );

	return WPSEO_Utils::get_roles();
}

/**
 * Check whether a url is relative.
 *
 * @deprecated 1.6.1
 * @deprecated use WPSEO_Utils::is_url_relative()
 * @see        WPSEO_Utils::is_url_relative()
 *
 * @param string $url URL input to check.
 *
 * @return bool
 */
function wpseo_is_url_relative( $url ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.6.1', 'WPSEO_Utils::is_url_relative()' );

	return WPSEO_Utils::is_url_relative( $url );
}

/**
 * Standardize whitespace in a string.
 *
 * @deprecated 1.6.1
 * @deprecated use WPSEO_Utils::standardize_whitespace()
 * @see        WPSEO_Utils::standardize_whitespace()
 *
 * @since      1.6.0
 *
 * @param string $string String input to standardize.
 *
 * @return string
 */
function wpseo_standardize_whitespace( $string ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 1.6.1', 'WPSEO_Utils::standardize_whitespace()' );

	return WPSEO_Utils::standardize_whitespace( $string );
}

/**
 * Initialize sitemaps. Add sitemap & XSL rewrite rules and query vars.
 *
 * @deprecated 2.4
 * @see WPSEO_Sitemaps_Router
 */
function wpseo_xml_sitemaps_init() {
	_deprecated_function( __FUNCTION__, 'WPSEO 2.4', 'WPSEO_Sitemaps_Router' );

	$options = get_option( 'wpseo_xml' );
	if ( $options['enablexmlsitemap'] !== true ) {
		return;
	}

	// Redirects sitemap.xml to sitemap_index.xml.
	add_action( 'template_redirect', 'wpseo_xml_redirect_sitemap', 0 );

	if ( ! is_object( $GLOBALS['wp'] ) ) {
		return;
	}

	$GLOBALS['wp']->add_query_var( 'sitemap' );
	$GLOBALS['wp']->add_query_var( 'sitemap_n' );
	$GLOBALS['wp']->add_query_var( 'xsl' );
	add_rewrite_rule( 'sitemap_index\.xml$', 'index.php?sitemap=1', 'top' );
	add_rewrite_rule( '([^/]+?)-sitemap([0-9]+)?\.xml$', 'index.php?sitemap=$matches[1]&sitemap_n=$matches[2]', 'top' );
	add_rewrite_rule( '([a-z]+)?-?sitemap\.xsl$', 'index.php?xsl=$matches[1]', 'top' );
}

/**
 * Redirect /sitemap.xml to /sitemap_index.xml.
 *
 * @deprecated 2.4
 * @see WPSEO_Sitemaps_Router
 */
function wpseo_xml_redirect_sitemap() {
	_deprecated_function( __FUNCTION__, 'WPSEO 2.4', 'WPSEO_Sitemaps_Router' );

	$current_url  = ( isset( $_SERVER['HTTPS'] ) && $_SERVER['HTTPS'] == 'on' ) ? 'https://' : 'http://';
	$current_url .= sanitize_text_field( $_SERVER['SERVER_NAME'] ) . sanitize_text_field( $_SERVER['REQUEST_URI'] );

	// Must be 'sitemap.xml' and must be 404.
	if ( home_url( '/sitemap.xml' ) == $current_url && $GLOBALS['wp_query']->is_404 ) {
		wp_redirect( home_url( '/sitemap_index.xml' ), 301 );
		exit;
	}
}

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
 * Invalidate XML sitemap cache for taxonomy / term actions.
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
 * Invalidate the XML sitemap cache for a post type when publishing or updating a post.
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
 * Create base URL for the sitemaps and applies filters.
 *
 * @since 1.5.7
 *
 * @deprecated 3.2
 * @deprecated use WPSEO_Sitemaps_Router::get_base_url()
 * @see        WPSEO_Sitemaps_Router::get_base_url()
 *
 * @param string $page Page to append to the base URL.
 *
 * @return string Base URL (incl page) for the sitemaps.
 */
function wpseo_xml_sitemaps_base_url( $page ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 3.2.0', 'WPSEO_Sitemaps_Router::get_base_url()' );

	return WPSEO_Sitemaps_Router::get_base_url( $page );
}

/**
 * Remove the bulk edit capability from the proper default roles.
 *
 * Contributor is still removed for legacy reasons.
 *
 * @deprecated 5.5
 */
function wpseo_remove_capabilities() {
	_deprecated_function( __FUNCTION__, 'WPSEO 5.5.0', 'WPSEO_Capability_Manager_Factory::get()->remove()' );

	WPSEO_Capability_Manager_Factory::get()->remove();
}

/**
 * Add the bulk edit capability to the proper default roles.
 *
 * @deprecated 5.5.0
 */
function wpseo_add_capabilities() {
	_deprecated_function( __FUNCTION__, 'WPSEO 5.5.0', 'WPSEO_Capability_Manager_Factory::get()->add()' );

	WPSEO_Capability_Manager_Factory::get()->add();
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

/**
 * Initializes the admin bar.
 *
 * @return void
 */
function wpseo_initialize_admin_bar() {
	$admin_bar_menu = new WPSEO_Admin_Bar_Menu();
	$admin_bar_menu->register_hooks();
}
add_action( 'wp_loaded', 'wpseo_initialize_admin_bar' );

/**
 * Allows editing of the meta fields through weblog editors like Marsedit.
 *
 * @param array $required_capabilities Capabilities that must all be true to allow action.
 * @param array $capabilities          Array of capabilities to be checked, unused here.
 * @param array $args                  List of arguments for the specific capabilities to be checked.
 *
 * @return array $required_capabilities Filtered capabilities.
 */
function allow_custom_field_edits( $required_capabilities, $capabilities, $args ) {
	if ( ! in_array( $args[0], array( 'edit_post_meta', 'add_post_meta' ), true ) ) {
		return $required_capabilities;
	}

	// If this is provided, it is the post ID.
	if ( empty( $args[2] ) ) {
		return $required_capabilities;
	}

	// If this is provided, it is the custom field.
	if ( empty( $args[3] ) ) {
		return $required_capabilities;
	}

	// If the meta key is part of the plugin, grant capabilities accordingly.
	if ( strpos( $args[3], WPSEO_Meta::$meta_prefix ) === 0 && current_user_can( 'edit_post', $args[2] ) ) {
		$required_capabilities[ $args[0] ] = true;
	}

	return $required_capabilities;
}

add_filter( 'user_has_cap', 'allow_custom_field_edits', 0, 3 );

/* ********************* DEPRECATED FUNCTIONS ********************* */

/**
 * Adds an SEO admin bar menu to the site admin, with several options.
 *
 * If the current user is an admin they can also go straight to several settings menus from here.
 *
 * @deprecated 7.9 Use WPSEO_Admin_Bar_Menu::add_menu() instead.
 * @codeCoverageIgnore
 *
 * @return void
 */
function wpseo_admin_bar_menu() {

	_deprecated_function( __FUNCTION__, 'WPSEO 7.9', 'WPSEO_Admin_Bar_Menu::add_menu()' );

	// Only use this admin bar menu for the site admin.
	if ( is_admin() && ! is_blog_admin() ) {
		return;
	}

	$options = WPSEO_Options::get_options( array( 'wpseo', 'wpseo_ms' ) );

	if ( $options['enable_admin_bar_menu'] !== true ) {
		return;
	}

	global $wp_admin_bar;

	$admin_bar_menu = new WPSEO_Admin_Bar_Menu();
	$admin_bar_menu->add_menu( $wp_admin_bar );
}

/**
 * Returns the SEO score element for the admin bar.
 *
 * @deprecated 7.9
 * @codeCoverageIgnore
 *
 * @return string
 */
function wpseo_adminbar_seo_score() {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.9', null );

	$rating = WPSEO_Meta::get_value( 'linkdex', get_the_ID() );

	return wpseo_adminbar_score( $rating );
}

/**
 * Returns the content score element for the adminbar.
 *
 * @deprecated 7.9
 * @codeCoverageIgnore
 *
 * @return string
 */
function wpseo_adminbar_content_score() {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.9', null );

	$rating = WPSEO_Meta::get_value( 'content_score', get_the_ID() );

	return wpseo_adminbar_score( $rating );
}

/**
 * Returns the SEO score element for the adminbar.
 *
 * @deprecated 7.9
 * @codeCoverageIgnore
 *
 * @return string
 */
function wpseo_tax_adminbar_seo_score() {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.9', null );

	$rating = 0;

	if ( is_tax() || is_category() || is_tag() ) {
		$rating = WPSEO_Taxonomy_Meta::get_meta_without_term( 'linkdex' );
	}

	return wpseo_adminbar_score( $rating );
}

/**
 * Returns the Content score element for the adminbar.
 *
 * @deprecated 7.9
 * @codeCoverageIgnore
 *
 * @return string
 */
function wpseo_tax_adminbar_content_score() {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.9', null );

	$rating = 0;

	if ( is_tax() || is_category() || is_tag() ) {
		$rating = WPSEO_Taxonomy_Meta::get_meta_without_term( 'content_score' );
	}

	return wpseo_adminbar_score( $rating );
}

/**
 * Takes The SEO score and makes the score icon for the adminbar with it.
 *
 * @deprecated 7.9
 * @codeCoverageIgnore
 *
 * @param int $score The 0-100 rating of the score. Can be either SEO score or content score.
 *
 * @return string $score_adminbar_element
 */
function wpseo_adminbar_score( $score ) {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.9', null );

	$score = WPSEO_Utils::translate_score( $score );

	$score_adminbar_element = '<div class="wpseo-score-icon adminbar-seo-score ' . $score . '"><span class="adminbar-seo-score-text screen-reader-text"></span></div>';

	return $score_adminbar_element;
}

/**
 * Enqueue CSS to format the Yoast SEO adminbar item.
 *
 * @deprecated 7.9 Use WPSEO_Admin_Bar_Menu::enqueue_assets() instead.
 * @codeCoverageIgnore
 */
function wpseo_admin_bar_style() {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.9', 'WPSEO_Admin_Bar_Menu::enqueue_assets()' );

	if ( ! is_admin_bar_showing() || WPSEO_Options::get( 'enable_admin_bar_menu' ) !== true ) {
		return;
	}

	if ( is_admin() && ! is_blog_admin() ) {
		return;
	}

	$admin_bar_menu = new WPSEO_Admin_Bar_Menu();
	$admin_bar_menu->enqueue_assets();
}

/**
 * Detects if the advanced settings are enabled.
 *
 * @deprecated 7.0
 * @codeCoverageIgnore
 */
function wpseo_advanced_settings_enabled() {
	_deprecated_function( __FUNCTION__, 'WPSEO 7.0', null );
}

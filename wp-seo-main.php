<?php

/**
 * @package Main
 */

if ( !defined( 'DB_NAME' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

if ( ! defined( 'WPSEO_PATH' ) ) {
	define( 'WPSEO_PATH', plugin_dir_path( WPSEO_FILE ) );
}
if ( ! defined( 'WPSEO_BASENAME' ) ) {
	define( 'WPSEO_BASENAME', WPSEO_FILE );
}

function wpseo_load_textdomain() {
	load_plugin_textdomain( 'wordpress-seo', false, dirname( plugin_basename( WPSEO_FILE ) ) . '/languages/' );
}
add_filter( 'wp_loaded', 'wpseo_load_textdomain' );


if ( version_compare( PHP_VERSION, '5.2', '<' ) ) {
	if ( is_admin() && ( !defined( 'DOING_AJAX' ) || !DOING_AJAX ) ) {
		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		deactivate_plugins( WPSEO_FILE );
		wp_die( sprintf( __( 'WordPress SEO requires PHP 5.2 or higher, as does WordPress 3.2 and higher. The plugin has now disabled itself. For more info, %s$1see this post%s$2.', 'wordpress-seo' ), '<a href="http://yoast.com/requires-php-52/">', '</a>' ) );
	} else {
		return;
	}
}

// WordPress SEO version
function wpseo_init() {
	require_once( WPSEO_PATH . 'inc/wpseo-functions.php' );

	$options = get_wpseo_options();

	if ( isset( $options['stripcategorybase'] ) && $options['stripcategorybase'] )
		require_once( WPSEO_PATH . 'inc/class-rewrite.php' );

	if ( isset( $options['enablexmlsitemap'] ) && $options['enablexmlsitemap'] )
		require_once( WPSEO_PATH . 'inc/class-sitemaps.php' );
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_frontend_init() {
	$options = get_wpseo_options();
	require_once( WPSEO_PATH . 'frontend/class-frontend.php' );
	if ( isset( $options['breadcrumbs-enable'] ) && $options['breadcrumbs-enable'] )
		require_once( WPSEO_PATH . 'frontend/class-breadcrumbs.php' );
	if ( isset( $options['twitter'] ) && $options['twitter'] )
		require_once( WPSEO_PATH . 'frontend/class-twitter.php' );
	if ( isset( $options['opengraph'] ) && $options['opengraph'] )
		require_once( WPSEO_PATH . 'frontend/class-opengraph.php' );
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_admin_init() {
	$options = get_wpseo_options();
	if ( isset( $_GET['wpseo_restart_tour'] ) ) {
		unset( $options['ignore_tour'] );
		update_option( 'wpseo', $options );
	}

	if ( isset( $options['yoast_tracking'] ) && $options['yoast_tracking'] ) {
		require_once( WPSEO_PATH . 'admin/class-tracking.php' );
	}

	require_once( WPSEO_PATH . 'admin/class-admin.php' );

	global $pagenow;
	if ( in_array( $pagenow, array( 'edit.php', 'post.php', 'post-new.php' ) ) ) {
		require_once( WPSEO_PATH . 'admin/class-metabox.php' );
		if ( isset( $options['opengraph'] ) && $options['opengraph'] )
			require_once( WPSEO_PATH . 'admin/class-opengraph-admin.php' );
	}

	if ( in_array( $pagenow, array( 'edit-tags.php' ) ) )
		require_once( WPSEO_PATH . 'admin/class-taxonomy.php' );

	if ( in_array( $pagenow, array( 'admin.php' ) ) )
		require_once( WPSEO_PATH . 'admin/class-config.php' );

	if ( !isset( $options['yoast_tracking'] ) || ( !isset( $options['ignore_tour'] ) || !$options['ignore_tour'] ) )
		require_once( WPSEO_PATH . 'admin/class-pointers.php' );

	if ( isset( $options['enablexmlsitemap'] ) && $options['enablexmlsitemap'] )
		require_once( WPSEO_PATH . 'admin/class-sitemaps-admin.php' );
}

add_action( 'plugins_loaded', 'wpseo_init', 14 );

if ( !defined( 'DOING_AJAX' ) || !DOING_AJAX )
	require_once( WPSEO_PATH . 'inc/wpseo-non-ajax-functions.php' );

if ( is_admin() ) {
	if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
		require_once( WPSEO_PATH . 'admin/ajax.php' );
	} else {
		add_action( 'plugins_loaded', 'wpseo_admin_init', 15 );
	}

	register_activation_hook( WPSEO_FILE, 'wpseo_activate' );
	register_deactivation_hook( WPSEO_FILE, 'wpseo_deactivate' );
} else {
	add_action( 'plugins_loaded', 'wpseo_frontend_init', 15 );
}
unset( $options );

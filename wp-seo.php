<?php
/*
Plugin Name: WordPress SEO
Version: 1.5.0-beta
Plugin URI: http://yoast.com/wordpress/seo/#utm_source=wpadmin&utm_medium=plugin&utm_campaign=wpseoplugin
Description: The first true all-in-one SEO solution for WordPress, including on-page content analysis, XML sitemaps and much more.
Author: Joost de Valk
Author URI: http://yoast.com/
Text Domain: wordpress-seo
Domain Path: /languages/
License: GPL v3

WordPress SEO Plugin
Copyright (C) 2008-2013, Joost de Valk - joost@yoast.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @package Main
 */

if ( !defined( 'DB_NAME' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

if ( !defined( 'WPSEO_PATH' ) )
	define( 'WPSEO_PATH', plugin_dir_path( __FILE__ ) );
if ( !defined( 'WPSEO_BASENAME' ) )
	define( 'WPSEO_BASENAME', plugin_basename( __FILE__ ) );

define( 'WPSEO_FILE', __FILE__ );

function wpseo_load_textdomain() {
	load_plugin_textdomain( 'wordpress-seo', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}
add_filter( 'init', 'wpseo_load_textdomain', 1 );


if ( version_compare( PHP_VERSION, '5.2', '<' ) ) {
	if ( is_admin() && ( !defined( 'DOING_AJAX' ) || !DOING_AJAX ) ) {
		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		deactivate_plugins( __FILE__ );
		wp_die( sprintf( __( 'WordPress SEO requires PHP 5.2 or higher, as does WordPress 3.2 and higher. The plugin has now disabled itself. For more info, %s$1see this post%s$2.', 'wordpress-seo' ), '<a href="http://yoast.com/requires-php-52/">', '</a>' ) );
	} else {
		return;
	}
}

define( 'WPSEO_VERSION', '1.5.0-beta' );

function wpseo_init() {
	require_once( WPSEO_PATH . 'inc/wpseo-functions.php' );

	$options = WPSEO_Options::get_all();

	if ( $options['stripcategorybase'] === true )
		require_once( WPSEO_PATH . 'inc/class-rewrite.php' );

	if ( $options['enablexmlsitemap'] === true )
		require_once( WPSEO_PATH . 'inc/class-sitemaps.php' );
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_frontend_init() {
	$options = WPSEO_Options::get_all();
	require_once( WPSEO_PATH . 'frontend/class-frontend.php' );
	if ( $options['breadcrumbs-enable'] === true )
		require_once( WPSEO_PATH . 'frontend/class-breadcrumbs.php' );
	if ( $options['twitter'] === true )
		require_once( WPSEO_PATH . 'frontend/class-twitter.php' );
	if ( $options['opengraph'] === true )
		require_once( WPSEO_PATH . 'frontend/class-opengraph.php' );
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_admin_init() {
	$options = WPSEO_Options::get_all();
	if ( isset( $_GET['wpseo_restart_tour'] ) ) {
		$options['ignore_tour'] = false;
		update_option( 'wpseo', $options );
	}

	if ( $options['yoast_tracking'] === true ) {
		require_once( WPSEO_PATH . 'admin/class-tracking.php' );
	}

	require_once( WPSEO_PATH . 'admin/class-admin.php' );

	global $pagenow;
	if ( in_array( $pagenow, array( 'edit.php', 'post.php', 'post-new.php' ) ) ) {
		require_once( WPSEO_PATH . 'admin/class-metabox.php' );
		if ( $options['opengraph'] === true )
			require_once( WPSEO_PATH . 'admin/class-opengraph-admin.php' );
	}

	if ( in_array( $pagenow, array( 'edit-tags.php' ) ) )
		require_once( WPSEO_PATH . 'admin/class-taxonomy.php' );

	if ( in_array( $pagenow, array( 'admin.php' ) ) )
		require_once( WPSEO_PATH . 'admin/class-config.php' );

	if ( $options['tracking_popup_done'] === false || $options['ignore_tour'] === false )
		require_once( WPSEO_PATH . 'admin/class-pointers.php' );

	if ( $options['enablexmlsitemap'] === true )
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

	register_activation_hook( __FILE__, 'wpseo_activate' );
	register_deactivation_hook( __FILE__, 'wpseo_deactivate' );
} else {
	add_action( 'plugins_loaded', 'wpseo_frontend_init', 15 );
}
unset( $options );

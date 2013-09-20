<?php
/*
Plugin Name: WordPress SEO
Version: 1.4.16
Plugin URI: http://yoast.com/wordpress/seo/#utm_source=wpadmin&utm_medium=plugin&utm_campaign=wpseoplugin
Description: The first true all-in-one SEO solution for WordPress, including on-page content analysis, XML sitemaps and much more.
Author: Joost de Valk
Author URI: http://yoast.com/
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

if ( !defined( 'WPSEO_URL' ) )
	define( 'WPSEO_URL', plugin_dir_url( __FILE__ ) );
if ( !defined( 'WPSEO_PATH' ) )
	define( 'WPSEO_PATH', plugin_dir_path( __FILE__ ) );
if ( !defined( 'WPSEO_BASENAME' ) )
	define( 'WPSEO_BASENAME', plugin_basename( __FILE__ ) );

define( 'WPSEO_FILE', __FILE__ );

function wpseo_load_textdomain() {
	load_plugin_textdomain( 'wordpress-seo', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
}
add_filter( 'wp_loaded', 'wpseo_load_textdomain' );

if ( version_compare( PHP_VERSION, '5.2', '<' ) ) {
	if ( is_admin() && ( !defined( 'DOING_AJAX' ) || !DOING_AJAX ) ) {
		require_once ABSPATH . '/wp-admin/includes/plugin.php';
		deactivate_plugins( __FILE__ );
		wp_die( sprintf( __( 'WordPress SEO requires PHP 5.2 or higher, as does WordPress 3.2 and higher. The plugin has now disabled itself. For more info, %s$1see this post%s$2.', 'wordpress-seo' ), '<a href="http://yoast.com/requires-php-52/">', '</a>' ) );
	} else {
		return;
	}
}

define( 'WPSEO_VERSION', '1.4.16' );

$pluginurl = plugin_dir_url( __FILE__ );
if ( strpos( $pluginurl, 'https' ) === 0 && strpos( get_bloginfo( 'url' ), 'https' ) !== 0 )
	$pluginurl = substr_replace( $pluginurl, 'http', 0, 5 );
define( 'WPSEO_FRONT_URL', $pluginurl );
unset( $pluginurl );

function wpseo_init() {
	require WPSEO_PATH . 'inc/wpseo-functions.php';

	$options = get_wpseo_options();

	if ( isset( $options['stripcategorybase'] ) && $options['stripcategorybase'] )
		require WPSEO_PATH . 'inc/class-rewrite.php';

	if ( isset( $options['enablexmlsitemap'] ) && $options['enablexmlsitemap'] )
		require WPSEO_PATH . 'inc/class-sitemaps.php';
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_frontend_init() {
	$options = get_wpseo_options();
	require WPSEO_PATH . 'frontend/class-frontend.php';
	if ( isset( $options['breadcrumbs-enable'] ) && $options['breadcrumbs-enable'] )
		require WPSEO_PATH . 'frontend/class-breadcrumbs.php';
	if ( isset( $options['twitter'] ) && $options['twitter'] )
		require WPSEO_PATH . 'frontend/class-twitter.php';
	if ( isset( $options['opengraph'] ) && $options['opengraph'] )
		require WPSEO_PATH . 'frontend/class-opengraph.php';
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
		require WPSEO_PATH . 'admin/class-tracking.php';
	}

	require WPSEO_PATH . 'admin/class-admin.php';

	global $pagenow;
	if ( in_array( $pagenow, array( 'edit.php', 'post.php', 'post-new.php' ) ) ) {
		require WPSEO_PATH . 'admin/class-metabox.php';
		if ( isset( $options['opengraph'] ) && $options['opengraph'] )
			require WPSEO_PATH . 'admin/class-opengraph-admin.php';
	}

	if ( in_array( $pagenow, array( 'edit-tags.php' ) ) )
		require WPSEO_PATH . 'admin/class-taxonomy.php';

	if ( in_array( $pagenow, array( 'admin.php' ) ) )
		require WPSEO_PATH . 'admin/class-config.php';

	if ( !isset( $options['yoast_tracking'] ) || ( !isset( $options['ignore_tour'] ) || !$options['ignore_tour'] ) )
		require WPSEO_PATH . 'admin/class-pointers.php';

	if ( isset( $options['enablexmlsitemap'] ) && $options['enablexmlsitemap'] )
		require WPSEO_PATH . 'admin/class-sitemaps-admin.php';
}

add_action( 'plugins_loaded', 'wpseo_init', 14 );

if ( !defined( 'DOING_AJAX' ) || !DOING_AJAX )
	require WPSEO_PATH . 'inc/wpseo-non-ajax-functions.php';

if ( is_admin() ) {
	if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
		require WPSEO_PATH . 'admin/ajax.php';
	} else {
		add_action( 'plugins_loaded', 'wpseo_admin_init', 15 );
	}

	register_activation_hook( __FILE__, 'wpseo_activate' );
	register_deactivation_hook( __FILE__, 'wpseo_deactivate' );
} else {
	add_action( 'plugins_loaded', 'wpseo_frontend_init', 15 );
}
unset( $options );

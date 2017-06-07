<?php
/**
 * @package WPSEO\Main
 */

/**
 * Plugin Name: Yoast SEO Premium
 * Version: 4.9
 * Plugin URI: https://yoast.com/wordpress/plugins/seo/#utm_source=wpadmin&utm_medium=plugin&utm_campaign=wpseoplugin
 * Description: The first true all-in-one SEO solution for WordPress, including on-page content analysis, XML sitemaps and much more.
 * Author: Team Yoast
 * Author URI: https://yoast.com/
 * Text Domain: wordpress-seo
 * Domain Path: /languages/
 * License: GPL v3
 */

/**
 * Yoast SEO Plugin
 * Copyright (C) 2008-2016, Yoast BV - support@yoast.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

if ( ! defined( 'WPSEO_FILE' ) ) {
	define( 'WPSEO_FILE', __FILE__ );
}

if ( ! defined( 'WPSEO_PREMIUM_PLUGIN_FILE' ) ) {
	define( 'WPSEO_PREMIUM_PLUGIN_FILE', __FILE__ );
}

$wpseo_premium_dir = plugin_dir_path( WPSEO_PREMIUM_PLUGIN_FILE ) . 'premium/';

// Run the redirects when frontend is being opened.
if ( ! is_admin() ) {
	require_once( $wpseo_premium_dir . 'classes/redirect/class-redirect-util.php' );
	require_once( $wpseo_premium_dir . 'classes/redirect/class-redirect-handler.php' );

	new WPSEO_Redirect_Handler();
}

/**
 * Filters the defaults for the `wpseo` option.
 *
 * @param array $wpseo_defaults The defaults for the `wpseo` option.
 *
 * @return array
 */
function wpseo_premium_add_general_option_defaults( array $wpseo_defaults ) {
	$premium_defaults = array(
		'enable_metabox_insights' => true,
		'enable_link_suggestions' => true,
	);

	return array_merge( $wpseo_defaults, $premium_defaults );
}
add_filter( 'wpseo_option_wpseo_defaults', 'wpseo_premium_add_general_option_defaults' );

// Load the WordPress SEO plugin.
require_once( dirname( WPSEO_FILE ) . '/wp-seo-main.php' );
require_once( dirname( WPSEO_PREMIUM_PLUGIN_FILE ) . '/premium/class-premium.php' );

WPSEO_Premium::autoloader();

/**
 * Run the upgrade for Yoast SEO Premium.
 */
function wpseo_premium_run_upgrade() {
	$upgrade_manager = new WPSEO_Upgrade_Manager();
	$upgrade_manager->run_upgrade( WPSEO_VERSION );
}

/*
 * If the user is admin, check for the upgrade manager.
 * Considered to use 'admin_init' but that is called too late in the process.
 */
if ( is_admin() ) {
	add_action( 'init', 'wpseo_premium_run_upgrade' );
}

/**
 * The premium setup
 */
function wpseo_premium_init() {
	new WPSEO_Premium();
}

add_action( 'plugins_loaded', 'wpseo_premium_init', 14 );

// Activation hook.
if ( is_admin() ) {
	register_activation_hook( __FILE__, array( 'WPSEO_Premium', 'install' ) );
}

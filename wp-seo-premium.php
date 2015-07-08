<?php
/**
 * @package WPSEO\Main
 */

/**
 * Plugin Name: WordPress SEO Premium
 * Version: 2.2.2
 * Plugin URI: http://yoast.com/wordpress/seo-premium/#utm_source=wpadmin&utm_medium=plugin&utm_campaign=wpseoplugin
 * Description: The first true all-in-one SEO solution for WordPress, including on-page content analysis, XML sitemaps and much more.
 * Author: Team Yoast
 * Author URI: https://yoast.com/
 * Text Domain: wordpress-seo
 * Domain Path: /languages/
 * License: GPL v3
 */

/**
 * WordPress SEO Plugin
 * Copyright (C) 2008-2014, Yoast BV - support@yoast.com
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

if ( is_admin() ) {
	// Add the hook to upgrade premium.
	require_once( plugin_dir_path( WPSEO_FILE ) . 'premium/classes/class-upgrade-manager.php' );
	add_action( 'wpseo_run_upgrade', array( new WPSEO_Upgrade_Manager, 'check_update' ) );
}

// Load the WordPress SEO plugin.
require_once( 'wp-seo-main.php' );

/**
 * The premium setup
 */
function wpseo_premium_init() {
	if ( file_exists( WPSEO_PATH . 'premium/class-premium.php' ) ) {
		require_once( WPSEO_PATH . 'premium/class-premium.php' );

		new WPSEO_Premium();
	}
}

add_action( 'plugins_loaded', 'wpseo_premium_init', 14 );

// Activation hook.
if ( is_admin() ) {
	require_once( WPSEO_PATH . 'premium/class-premium.php' );
	register_activation_hook( __FILE__, array( 'WPSEO_Premium', 'install' ) );
}

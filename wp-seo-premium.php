<?php
/*
Plugin Name: WordPress SEO Premium
Version: 1.0.3
Plugin URI: http://yoast.com/wordpress/seo-premium/#utm_source=wpadmin&utm_medium=plugin&utm_campaign=wpseoplugin
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

define( 'WPSEO_VERSION', '1.4.25' );

if ( ! defined( 'WPSEO_FILE' ) ) {
	define( 'WPSEO_FILE', __FILE__ );
}

// Load the WordPress SEO plugin
require_once( 'wp-seo-main.php' );

// Premium setup
function wpseo_premium_init() {
	if ( file_exists( WPSEO_PATH . 'premium/class-premium.php' ) ) {
		require_once( WPSEO_PATH . 'premium/class-premium.php' );

		new WPSEO_Premium();
	}
}

add_action( 'plugins_loaded', 'wpseo_premium_init', 14 );

// Activation hook
if ( is_admin() ) {
	require_once( WPSEO_PATH . 'premium/class-premium.php' );
	register_activation_hook( __FILE__, array( 'WPSEO_Premium', 'install' ) );
}
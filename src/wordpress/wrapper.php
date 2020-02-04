<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\WordPress
 */

namespace Yoast\WP\SEO\WordPress;

/**
 * Wrapper class for WordPress globals.
 * This consists of factory functions to inject WP globals into the dependency container.
 */
class Wrapper {

	/**
	 * Wrapper method for returning the wpdb object for use in dependency injection.
	 *
	 * @return \wpdb The wpdb global.
	 */
	public static function get_wpdb() {
		global $wpdb;

		return $wpdb;
	}

	/**
	 * Wrapper method for returning the wp_query object for use in dependency injection.
	 *
	 * @return \WP_Query The wp_query global.
	 */
	public static function get_wp_query() {
		global $wp_query;

		return $wp_query;
	}
}

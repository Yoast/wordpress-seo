<?php
/**
 * WPDB wrapper definition.
 *
 * @package Yoast\YoastSEO\WordPress
 */

namespace Yoast\WP\Free\WordPress;

class Wrapper {
	public static function get_wpdb() {
		global $wpdb;

		return $wpdb;
	}

	public static function get_wp_query() {
		global $wp_query;

		return $wp_query;
	}
}

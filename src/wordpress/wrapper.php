<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\WordPress
 */

namespace Yoast\WP\SEO\WordPress;

use wpdb;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Replace_Vars;
use Yoast_Notification_Center;

/**
 * Wrapper class for WordPress globals.
 * This consists of factory functions to inject WP globals into the dependency container.
 */
class Wrapper {

	/**
	 * Wrapper method for returning the wpdb object for use in dependency injection.
	 *
	 * @return wpdb The wpdb global.
	 */
	public static function get_wpdb() {
		global $wpdb;

		return $wpdb;
	}

	/**
	 * Factory function for replace vars helper.
	 *
	 * @return WPSEO_Replace_Vars The replace vars helper.
	 */
	public static function get_replace_vars() {
		return new WPSEO_Replace_Vars();
	}

	/**
	 * Factory function for the admin asset manager.
	 *
	 * @return WPSEO_Admin_Asset_Manager The admin asset manager.
	 */
	public static function get_admin_asset_manager() {
		return new WPSEO_Admin_Asset_Manager();
	}
}

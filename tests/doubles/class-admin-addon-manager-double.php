<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Addon_Manager_Double extends WPSEO_Addon_Manager {

	/**
	 * Checks if the given plugin_file belongs to a Yoast addon.
	 *
	 * @param string $plugin_file Path to the plugin.
	 *
	 * @return bool True when plugin file is for a Yoast addon.
	 */
	public function is_yoast_addon( $plugin_file ) {
		return parent::is_yoast_addon( $plugin_file );
	}

	/**
	 * Retrieves the addon slug by given plugin file path.
	 *
	 * @param string $plugin_file The file path to the plugin.
	 *
	 * @return string The slug when found or empty string when not.
	 */
	public function get_slug_by_plugin_file( $plugin_file ) {
		return parent::get_slug_by_plugin_file( $plugin_file );
	}

	/**
	 * Converts a subscription to plugin based format.
	 *
	 * @param stdClass $subscription The subscription to convert.
	 *
	 * @return stdClass The converted subscription.
	 */
	public function convert_subscription_to_plugin( $subscription ) {
		return parent::convert_subscription_to_plugin( $subscription );
	}
}

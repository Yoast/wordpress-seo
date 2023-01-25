<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Inc;

use Brain\Monkey;
use stdClass;
use WPSEO_Addon_Manager;

/**
 * Test Helper Class.
 */
class Addon_Manager_Double extends WPSEO_Addon_Manager {

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
	 * @param stdClass      $subscription    The subscription to convert.
	 * @param stdClass|null $yoast_free_data The Yoast Free's data.
	 * @param bool          $plugin_info     Whether we're in the plugin information modal.
	 *
	 * @return stdClass The converted subscription.
	 */
	public function convert_subscription_to_plugin( $subscription, $yoast_free_data = null, $plugin_info = false, $plugin_file = '' ) {
		Monkey\Functions\expect( '_get_plugin_data_markup_translate' )
			->withAnyArgs()
			->andReturn( (object) $subscription );

		return parent::convert_subscription_to_plugin( $subscription, $yoast_free_data, $plugin_info );
	}

	/**
	 * Retrieves the Yoast addons.
	 *
	 * @return array The installed plugins.
	 */
	public function get_installed_addons() {
		return parent::get_installed_addons();
	}

	/**
	 * Retrieves a list of active addons.
	 *
	 * @return array The active addons.
	 */
	public function get_active_addons() {
		return parent::get_active_addons();
	}

	/**
	 * Checks whether a plugin expiry date has been passed.
	 *
	 * @param stdClass $subscription Plugin subscription.
	 *
	 * @return bool Has the plugin expired.
	 */
	public function has_subscription_expired( $subscription ) {
		return parent::has_subscription_expired( $subscription );
	}

	/**
	 * Checks if there are any installed addons.
	 *
	 * @return bool True when there are installed Yoast addons.
	 */
	public function has_installed_addons() {
		return parent::has_installed_addons();
	}
}

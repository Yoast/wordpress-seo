<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Integrations;

use Yoast\WP\SEO\Integrations\Settings_Integration;

/**
 * Test Helper Class.
 */
final class Settings_Integration_Double extends Settings_Integration {

	/**
	 * Override the constructor to avoid calling that logic.
	 */
	public function __construct() {
		// Intentionally left empty.
	}

	/**
	 * Test double. Retrieves the default setting values.
	 *
	 * @return array<string, array<string, mixed>> The default setting values.
	 */
	public function get_default_setting_values() {
		return parent::get_default_setting_values();
	}

	/**
	 * Test double. Retrieves the settings and their values.
	 *
	 * @param array<string, array<string, mixed>> $default_setting_values The default setting values.
	 *
	 * @return array<string, array<string, mixed>> The settings.
	 */
	public function get_settings( $default_setting_values ) {
		return parent::get_settings( $default_setting_values );
	}
}

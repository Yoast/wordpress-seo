<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Models;

use Yoast\WP\SEO\Models\Settings\Global_Settings_Model;

/**
 * Class Settings_Model_Double.
 *
 * @property string $settings_key
 * @property string $new_settings_key
 */
class Settings_Model_Double extends Global_Settings_Model {

	/**
	 * Get the definitions for the settings.
	 *
	 * @return array<string, array> Description of the settings with the setting name as key.
	 */
	public function get_settings() {
		return [
			'settings_key' => [
				'default' => '',
			],
			'new_settings_key' => [
				'default' => '',
			],
		];
	}
}

<?php

namespace Yoast\WP\SEO\Models\Settings;

/**
 * Class Search_Engine_Verify_Settings.
 *
 * @property string $baiduverify
 * @property string $googleverify
 * @property string $msverify
 * @property string $yandexverify
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- 4 words is fine.
 */
class Search_Engine_Verify_Settings extends Global_Settings_Model {

	/**
	 * Get the definitions for the search engine verify settings.
	 *
	 * @return array<string, array> Description of the settings with the setting name as key.
	 */
	public function get_settings() {
		return [
			'baiduverify'  => [
				'default' => '',
			],
			'googleverify' => [
				'default' => '',
			],
			'msverify'     => [
				'default' => '',
			],
			'yandexverify' => [
				'default' => '',
			],
		];
	}
}

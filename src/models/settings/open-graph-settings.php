<?php

namespace Yoast\WP\SEO\Models\Settings;

/**
 * Class Open_Graph_Settings.
 *
 * @property bool   $opengraph
 * @property string $og_default_image
 * @property string $og_default_image_id
 * @property string $og_frontpage_title
 * @property string $og_frontpage_desc
 * @property string $og_frontpage_image
 * @property string $og_frontpage_image_id
 */
class Open_Graph_Settings extends Global_Settings_Model {

	/**
	 * Get the definitions for the Open Graph settings.
	 *
	 * @return array<string, array> Description of the settings with the setting name as key.
	 */
	public function get_settings() {
		return [
			'opengraph'             => [
				'default' => true,
			],
			'og_default_image'      => [
				'default' => '',
			],
			'og_default_image_id'   => [
				'default' => '',
			],
			'og_frontpage_title'    => [
				'default' => '',
			],
			'og_frontpage_desc'     => [
				'default' => '',
			],
			'og_frontpage_image'    => [
				'default' => '',
			],
			'og_frontpage_image_id' => [
				'default' => '',
			],
		];
	}
}

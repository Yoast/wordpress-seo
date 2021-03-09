<?php

namespace Yoast\WP\SEO\Models\Settings;

/**
 * Class Social_Settings.
 *
 * @property string $facebook_site
 * @property string $instagram_url
 * @property string $linkedin_url
 * @property string $myspace_url
 * @property string $pinterest_url
 * @property string $pinterestverify
 * @property bool   $twitter
 * @property string $twitter_site
 * @property string $twitter_card_type
 * @property string $youtube_url
 * @property string $wikipedia_url
 */
class Social_Settings extends Global_Settings_Model {

	/**
	 * Get the definitions for the social settings.
	 *
	 * @return array<string, array> Description of the settings with the setting name as key.
	 */
	public function get_settings() {
		return [
			'facebook_site'     => [
				'default' => '',
			],
			'instagram_url'     => [
				'default' => '',
			],
			'linkedin_url'      => [
				'default' => '',
			],
			'myspace_url'       => [
				'default' => '',
			],
			'pinterest_url'     => [
				'default' => '',
			],
			'pinterestverify'   => [
				'default' => '',
			],
			'twitter'           => [
				'default' => true,
			],
			'twitter_site'      => [
				'default' => '',
			],
			'twitter_card_type' => [
				'default' => 'summary_large_image',
			],
			'youtube_url'       => [
				'default' => '',
			],
			'wikipedia_url'     => [
				'default' => '',
			],
		];
	}
}

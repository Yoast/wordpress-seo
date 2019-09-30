<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Tracking
 */

/**
 * Collects anonymized settings data.
 */
class WPSEO_Tracking_Settings_Data implements WPSEO_Collection {

	/**
	 * @var array $anonymous_settings contains all of the option_names which need to be
	 * anonimized before they can be sent elsewhere.
	 */
	private $anonymous_settings = array(
		'baiduverify',
		'googleverify',
		'msverify',
		'yandexverify',
		'website_name',
		'alternate_website_name',
		'company_logo',
		'company_name',
		'person_name',
		'person_logo',
		'person_logo_id',
		'company_logo_id',
		'facebook_site',
		'instagram_url',
		'linkedin_url',
		'myspace_url',
		'pinterest_url',
		'pinterestverify',
		'twitter_site',
		'youtube_url',
		'wikipedia_url',
		'fbadminapp',
	);

	/**
	 * Returns the collection data.
	 *
	 * @return array The collection data.
	 */
	public function get() {

		return array(
			'settings' => $this->anonymize_settings( WPSEO_Options::get_all() ),
		);
	}

	/**
	 * Anonimizes the WPSEO_Options array by replacing all $anonymous_settings values to 'used'.
	 *
	 * @param array $settings The settings.
	 * @return array The anonymized settings.
	 */
	private function anonymize_settings( $settings ) {
		foreach ( $this->anonymous_settings as $setting ) {
			if ( ! empty( $settings[ $setting ] ) ) {
				$settings[ $setting ] = 'used';
			}
		}
		return $settings;
	}
}

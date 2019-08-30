<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Tracking
 */

/**
 * Collects anonimized settings data.
 */
class WPSEO_Tracking_Settings_Data implements WPSEO_Collection {

	/**
	 * @var array ANONYMOUS_SETTINGS contains all of the option_names which need to be
	 * anonimized before they can be sent elsewhere.
	 */
	const ANONYMOUS_SETTINGS = [
		"baiduverify", "googleverify", "msverify", "yandexverify", "website_name",
		"alternate_website_name", "company_logo", "company_name", "person_name",
		"person_logo", "person_logo_id", "company_logo_id", "facebook_site",
		"instagram_url", "linkedin_url", "myspace_url", "pinterest_url",
		"pinterestverify", "twitter_site", "youtube_url", "wikipedia_url",
		"fbadminapp",
	];

	/**
	 * Returns the collection data.
	 *
	 * @return array The collection data.
	 */
	public function get() {

		return array(
			'settings' => $this->anonimize_settings( WPSEO_Options::get_all() ),
		);
	}

	private function anonimize_settings( $settings ) {
		foreach( $this::ANONYMOUS_SETTINGS as $setting ) {
			if ( ! empty ( $settings[ $setting ] ) ) {
				$settings[ $setting ] = 'used';
			}
		}
		return $settings;
	}
}

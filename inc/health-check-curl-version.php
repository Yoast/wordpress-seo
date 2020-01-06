<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Represents the health check for the cURL version.
 */
class WPSEO_Health_Check_Curl_Version extends WPSEO_Health_Check {

	/**
	 * The name of the test.
	 *
	 * @var string
	 */
	protected $test = 'yoast-health-check-curl-version';

	/**
	 * Runs the test.
	 *
	 * @return void
	 */
	public function run() {
		$curl_version = $this->get_curl_version();

		if ( $curl_version === false ) {
			return;
		}

		// Run the test only when either Yoast SEO Premium or premium add-ons are installed and we can't reach MyYoast.
		if ( ! $this->has_premium_plugins_installed() || $this->is_my_yoast_api_reachable() ) {
			return;
		}

		// Note: as of January 2020, the most recent cURL version is 7.67.0.
		if ( $this->is_recent_curl_version() ) {
			$this->label          = esc_html__( 'Your cURL PHP module is up-to-date', 'wordpress-seo' );
			$this->status         = self::STATUS_GOOD;
			$this->badge['color'] = 'blue';
			$this->description    = sprintf(
					/* translators: %1$s expands to 'Yoast'. */
					esc_html__( 'Your server has a recent version of the cURL PHP module. Running a recent cURL version allows the %1$s plugins license activation to work correctly.', 'wordpress-seo' ),
					'Yoast'
				);

			return;
		}

		$this->label          = esc_html__( 'Your cURL PHP module is outdated', 'wordpress-seo' );
		$this->status         = self::STATUS_RECOMMENDED;
		$this->badge['color'] = 'red';

		$this->description = sprintf(
			/* translators: %1$s expands to the cURL version, %2$s expands to 'Yoast', %3$s is a link start tag to the Yoast knowledge base, %4$s is the link closing tag. */
			__( 'Your server has an outdated version of the PHP module cURL (Version: %1$s). Running an outdated cURL version may cause %2$s plugins license activation errors. Please ask your hosting company to update cURL to a more recent version. You can %3$sread more about cURL in our knowledge base%4$s.', 'wordpress-seo' ),
			$curl_version,
			'Yoast',
			'<a href="http://kb.yoast.com/article/90-is-my-curl-up-to-date" target="_blank">',
			WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
		);
	}

	/**
	 * Gets the current cURL version.
	 *
	 * @return mixed The cURL version as a string or false if cURL is not installed.
	 */
	protected function get_curl_version() {
		if ( function_exists( 'curl_version' ) ) {
			$curl_version = curl_version();

			if ( isset( $curl_version['version'] ) ) {
				return $curl_version['version'];
			}
		}

		return false;
	}

	/**
	 * Checks if the cURL version is a recent one.
	 *
	 * @return bool Whether the cURL version is a recent one.
	 */
	protected function is_recent_curl_version() {
		$curl_version = $this->get_curl_version();

		if ( $curl_version && version_compare( $curl_version, '7.20.0', '>=' ) ) {
			return true;
		}

		return false;
	}

	/**
	 * Checks whether Yoast SEO Premium or premium add-ons are installed.
	 *
	 * @return bool Whether Yoast SEO Premium or premium add-ons are installed.
	 */
	protected function has_premium_plugins_installed() {
		$addon_manager = new WPSEO_Addon_Manager();

		if ( empty( $addon_manager->get_installed_addons() ) ) {
			return false;
		}

		return true;
	}

	/**
	 * Checks whether the MyYoast API is reachable.
	 *
	 * @return bool Whether the MyYoast API is reachable.
	 */
	protected function is_my_yoast_api_reachable() {
		$api_request = new WPSEO_MyYoast_Api_Request( 'sites/current' );

		return $api_request->fire();
	}
}

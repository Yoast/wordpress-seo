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
		if ( $this->get_curl_version() === false ) {
			return;
		}

		$api_request = new WPSEO_MyYoast_Api_Request( 'sites/current' );

		// Run the test only when either Premium or an add-on is installed and we can't reach MyYoast.
		if ( ! empty( $this->get_installed_premium_plugins() ) && $api_request->fire() === false ) {
			return;
		}

		// Note: as of January 2020, the most recent cURL version is 7.67.0.
		if ( version_compare( $this->get_curl_version(), '7.20.0', '>=' ) ) {
			$this->label          = esc_html__( 'Your cURL PHP module is up-to-date', 'wordpress-seo' );
			$this->status         = self::STATUS_GOOD;
			$this->badge['color'] = 'blue';
			$this->description    = sprintf(
					/* translators: %1$s expands to 'Yoast'. */
					esc_html__( 'Your server has a recent version of the cURL PHP module. Running a recent cURL version allows %1$s plugins license activation to work correctly.', 'wordpress-seo' ),
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
			$this->get_curl_version(),
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
	private function get_curl_version() {
		if ( function_exists( 'curl_version' ) ) {
			$curl_version = curl_version();

			if ( isset( $curl_version['version'] ) ) {
				return $curl_version['version'];
			}
		}

		return false;
	}

	/**
	 * Gets the Yoast Premium and the premium add-ons information.
	 *
	 * @return array Yoast Premium and premium add-ons information. Empty array if none installed.
	 */
	private function get_installed_premium_plugins() {
		$addon_manager = new WPSEO_Addon_Manager();
		return $addon_manager->get_installed_addons();
	}
}

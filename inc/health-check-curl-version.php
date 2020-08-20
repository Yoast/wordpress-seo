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
		if ( ! $this->has_premium_plugins_installed() ) {
			return;
		}

		if ( ! $this->is_my_yoast_api_reachable() && $this->is_recent_curl_version() ) {
			$this->label = sprintf(
				/* translators: %1$s expands to 'my.yoast.com'. */
				esc_html__( 'Your site can not connect to %1$s', 'wordpress-seo' ),
				'my.yoast.com'
			);
			$this->status         = self::STATUS_CRITICAL;
			$this->badge['color'] = 'red';
			$this->description    = sprintf(
				/* translators: %1$s Emphasis open tag, %2$s: Emphasis close tag, %3$s Link start tag to the Yoast knowledge base, %4$s Link closing tag. */
				esc_html__( 'You can %1$snot%2$s activate your premium plugin(s) and receive updates. A common cause for not being able to connect is an out-of-date version of cURL, software used to connect to other servers. However, your cURL version seems fine. Please talk to your host and, if needed, the Yoast support team to figure out what is broken. %3$sRead more about cURL in our knowledge base%4$s.', 'wordpress-seo' ),
				'<em>',
				'</em>',
				'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3u8' ) ) . '" target="_blank">',
				WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
			);

			return;
		}

		// Note: as of January 2020, the most recent cURL version is 7.67.0.
		if ( ! $this->is_my_yoast_api_reachable() && ! $this->is_recent_curl_version() ) {
			$this->label = sprintf(
				/* translators: %1$s expands to 'my.yoast.com'. */
				esc_html__( 'Your site can not connect to %1$s', 'wordpress-seo' ),
				'my.yoast.com'
			);
			$this->status         = self::STATUS_CRITICAL;
			$this->badge['color'] = 'red';
			$this->description    = sprintf(
				/* translators: %1$s Emphasis open tag, %2$s: Emphasis close tag, %3$s Link start tag to the Yoast knowledge base, %4$s Link closing tag. */
				esc_html__( 'You can %1$snot%2$s activate your premium plugin(s) and receive updates. The cause for this error is probably that the cURL software on your server is too old. Please contact your host and ask them to update it to at least version 7.34. %3$sRead more about cURL in our knowledge base%4$s.', 'wordpress-seo' ),
				'<em>',
				'</em>',
				'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3u8' ) ) . '" target="_blank">',
				WPSEO_Admin_Utils::get_new_tab_message() . '</a>'
			);
			return;
		}

		$this->label = sprintf(
			/* translators: %1$s expands to 'my.yoast.com'. */
			esc_html__( 'Your site can connect to %1$s', 'wordpress-seo' ),
			'my.yoast.com'
		);
		$this->status         = self::STATUS_GOOD;
		$this->badge['color'] = 'blue';
		$this->description    = esc_html__( 'Great! You can activate your premium plugin(s) and receive updates.', 'wordpress-seo' );
	}

	/**
	 * Gets the current cURL version.
	 *
	 * @return string|bool The cURL version as a string or false if cURL is not installed.
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

		if ( $curl_version && version_compare( $curl_version, '7.34.0', '>=' ) ) {
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

		return $addon_manager->has_installed_addons();
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

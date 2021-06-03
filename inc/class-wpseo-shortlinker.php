<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

/**
 * Helps with creating shortlinks in the plugin.
 */
class WPSEO_Shortlinker {

	/**
	 * Collects the additional data necessary for the shortlink.
	 *
	 * @return array The shortlink data.
	 */
	protected function collect_additional_shortlink_data() {
		return [
			'php_version'      => $this->get_php_version(),
			'platform'         => 'wordpress',
			'platform_version' => $this->get_platform_version(),
			'software'         => $this->get_software(),
			'software_version' => WPSEO_VERSION,
			'days_active'      => $this->get_days_active(),
			'user_language'    => $this->get_user_language(),
		];
	}

	/**
	 * Builds a URL to use in the plugin as shortlink.
	 *
	 * @param string $url The URL to build upon.
	 *
	 * @return string The final URL.
	 */
	public function build_shortlink( $url ) {
		return add_query_arg( $this->collect_additional_shortlink_data(), $url );
	}

	/**
	 * Returns a version of the URL with a utm_content with the current version.
	 *
	 * @param string $url The URL to build upon.
	 *
	 * @return string The final URL.
	 */
	public static function get( $url ) {
		$shortlinker = new self();

		return $shortlinker->build_shortlink( $url );
	}

	/**
	 * Echoes a version of the URL with a utm_content with the current version.
	 *
	 * @param string $url The URL to build upon.
	 */
	public static function show( $url ) {
		echo esc_url( self::get( $url ) );
	}

	/**
	 * Gets the shortlink's query params.
	 *
	 * @return array The shortlink's query params.
	 */
	public static function get_query_params() {
		$shortlinker = new self();

		return $shortlinker->collect_additional_shortlink_data();
	}

	/**
	 * Gets the current site's PHP version, without the extra info.
	 *
	 * @return string The PHP version.
	 */
	private function get_php_version() {
		$version = explode( '.', PHP_VERSION );

		return (int) $version[0] . '.' . (int) $version[1];
	}

	/**
	 * Gets the current site's platform version.
	 *
	 * @return string The wp_version.
	 */
	protected function get_platform_version() {
		return $GLOBALS['wp_version'];
	}

	/**
	 * Get our software and whether it's active or not.
	 *
	 * @return string The software name + activation state.
	 */
	private function get_software() {
		if ( YoastSEO()->helpers->product->is_premium() ) {
			return 'premium';
		}

		return 'free';
	}

	/**
	 * Gets the number of days the plugin has been active.
	 *
	 * @return int The number of days the plugin is active.
	 */
	private function get_days_active() {
		$date_activated = WPSEO_Options::get( 'first_activated_on' );
		$datediff       = ( time() - $date_activated );
		$days           = (int) round( $datediff / DAY_IN_SECONDS );
		switch ( $days ) {
			case 0:
			case 1:
				$cohort = '0-1';
				break;
			case ( $days < 5 ):
				$cohort = '2-5';
				break;
			case ( $days < 30 ):
				$cohort = '6-30';
				break;
			case ( $days < 91 ):
				$cohort = '31-90';
				break;
			case ( $days < 181 ):
				$cohort = '91-180';
				break;
			case ( $days < 366 ):
				$cohort = '181-365';
				break;
			default:
				$cohort = '365plus';
		}
		return $cohort;
	}

	/**
	 * Gets the user's language.
	 *
	 * @return string|false The user's language or `false` when it couldn't be retrieved.
	 */
	private function get_user_language() {
		if ( function_exists( 'get_user_locale' ) ) {
			return get_user_locale();
		}

		return false;
	}
}

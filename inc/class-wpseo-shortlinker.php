<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO
 */

/**
 * Helps with creating shortlinks in the plugin
 */
class WPSEO_Shortlinker {

	/**
	 * Builds a URL to use in the plugin as shortlink.
	 *
	 * @param string $url The URL to build upon.
	 *
	 * @return string The final URL.
	 */
	public function build_shortlink( $url ) {
		return add_query_arg(
			array(
				'php_version'      => $this->get_php_version(),
				'platform'         => 'wordpress',
				'platform_version' => $GLOBALS['wp_version'],
				'software'         => $this->get_software(),
				'software_version' => WPSEO_VERSION,
				'role'             => $this->get_filtered_user_role(),
				'days_active'      => $this->get_days_active(),
			),
			$url
		);
	}

	/**
	 * Returns a version of the URL with a utm_content with the current version.
	 *
	 * @param string $url The URL to build upon.
	 *
	 * @return string The final URL.
	 */
	public static function get( $url ) {
		$shortlinker = new WPSEO_Shortlinker();

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
	 * Gets the current site's PHP version, without the extra info.
	 *
	 * @return string The PHP version.
	 */
	private function get_php_version() {
		$version = explode( '.', PHP_VERSION );

		return (int) $version[0] . '.' . (int) $version[1] . '.' . (int) $version[2];
	}

	/**
	 * Get our software and whether it's active or not.
	 *
	 * @return string The software name + activation state.
	 */
	private function get_software() {
		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			return 'premium';
		}

		return 'free';
	}

	/**
	 * Gets the current user's role without leaking roles that shouldn't be public.
	 *
	 * @return string The filtered user role.
	 */
	private function get_filtered_user_role() {
		$user           = wp_get_current_user();
		$built_in_roles = array(
			'administrator',
			'wpseo_manager',
			'wpseo_editor',
			'editor',
			'author',
			'contributor',
			'subscriber',
		);
		$filtered_roles = array_intersect( $built_in_roles, $user->roles );

		$role = current( $filtered_roles );
		if ( ! $role ) {
			$role = 'unknown';
		}
		return $role;
	}

	/**
	 * Gets the number of days the plugin has been active.
	 *
	 * @return int The number of days the plugin is active.
	 */
	private function get_days_active() {
		$date_activated = WPSEO_Options::get( 'first_activated_on' );
		$datediff       = ( time() - $date_activated );

		return (int) round( $datediff / DAY_IN_SECONDS );
	}
}

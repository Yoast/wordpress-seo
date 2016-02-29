<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Helpers for redirects
 */
class WPSEO_Redirect_Util {
	/**
	 * @var bool
	 */
	protected static $has_permalink_trailing_slash = null;

	/**
	 * Returns whether or not a URL is a relative URL.
	 *
	 * @param string $url The URL to determine the relativity for.
	 * @return bool
	 */
	public static function is_relative_url( $url ) {
		$url_scheme = parse_url( $url, PHP_URL_SCHEME );

		return ! $url_scheme;
	}

	/**
	 * Returns whether or not the permalink structure has a trailing slash
	 *
	 * @return bool
	 */
	public static function has_permalink_trailing_slash() {
		if ( null === self::$has_permalink_trailing_slash ) {
			$permalink_structure = get_option( 'permalink_structure' );

			self::$has_permalink_trailing_slash = substr( $permalink_structure, -1 ) === '/';
		}

		return self::$has_permalink_trailing_slash;
	}
}

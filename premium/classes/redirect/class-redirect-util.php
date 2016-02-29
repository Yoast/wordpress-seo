<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Helpers for redirects
 */
class WPSEO_Redirect_Util {

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
}

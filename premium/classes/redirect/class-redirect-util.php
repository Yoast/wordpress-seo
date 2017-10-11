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
	public static $has_permalink_trailing_slash = null;

	/**
	 * Returns whether or not a URL is a relative URL.
	 *
	 * @param string $url The URL to determine the relativity for.
	 * @return bool
	 */
	public static function is_relative_url( $url ) {
		// @todo Replace with call to wp_parse_url() once minimum requirement has gone up to WP 4.7.
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

	/**
	 * Returns whether or not the URL has query variables
	 *
	 * @param string $url The URL.
	 * @return bool
	 */
	public static function has_query_parameters( $url ) {
		return false !== strpos( $url, '?' );
	}

	/**
	 * Returns whether or not the given URL has a fragment identifier
	 *
	 * @param string $url The URL to parse.
	 *
	 * @return bool
	 */
	public static function has_fragment_identifier( $url ) {
		// Deal with this case if the last character is a hash.
		if ( '#' === substr( $url, -1 ) ) {
			return true;
		}

		// @todo Replace with call to wp_parse_url() once minimum requirement has gone up to WP 4.7.
		$fragment = parse_url( $url, PHP_URL_FRAGMENT );

		return ! empty( $fragment );
	}

	/**
	 * Returns whether or not the given URL has an extension
	 *
	 * @param string $url The URL to parse.
	 *
	 * @return bool Whether or not the given URL has an extension.
	 */
	public static function has_extension( $url ) {
		// @todo Replace with call to wp_parse_url() once minimum requirement has gone up to WP 4.7.
		$parsed = parse_url( $url, PHP_URL_PATH );

		return false !== strpos( $parsed, '.' );
	}

	/**
	 * Returns whether or not a target URL requires a trailing slash
	 *
	 * @param string $target_url The target URL to check.
	 *
	 * @return bool
	 */
	public static function requires_trailing_slash( $target_url ) {
		return
			'/' !== $target_url &&
			self::has_permalink_trailing_slash() &&
			self::is_relative_url( $target_url ) &&
			! self::has_query_parameters( $target_url ) &&
			! self::has_fragment_identifier( $target_url ) &&
			! self::has_extension( $target_url );
	}
}

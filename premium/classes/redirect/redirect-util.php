<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Helpers for redirects.
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
		$url_scheme = wp_parse_url( $url, PHP_URL_SCHEME );

		return ! $url_scheme;
	}

	/**
	 * Returns whether or not the permalink structure has a trailing slash.
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
	 * Returns whether or not the URL has query variables.
	 *
	 * @param string $url The URL.
	 * @return bool
	 */
	public static function has_query_parameters( $url ) {
		return false !== strpos( $url, '?' );
	}

	/**
	 * Returns whether or not the given URL has a fragment identifier.
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

		$fragment = wp_parse_url( $url, PHP_URL_FRAGMENT );

		return ! empty( $fragment );
	}

	/**
	 * Returns whether or not the given URL has an extension.
	 *
	 * @param string $url The URL to parse.
	 *
	 * @return bool Whether or not the given URL has an extension.
	 */
	public static function has_extension( $url ) {
		$parsed = wp_parse_url( $url, PHP_URL_PATH );

		return false !== strpos( $parsed, '.' );
	}

	/**
	 * Returns whether or not a target URL requires a trailing slash.
	 *
	 * @param string $target_url The target URL to check.
	 *
	 * @return bool
	 */
	public static function requires_trailing_slash( $target_url ) {
		return '/' !== $target_url &&
			self::has_permalink_trailing_slash() &&
			self::is_relative_url( $target_url ) &&
			! self::has_query_parameters( $target_url ) &&
			! self::has_fragment_identifier( $target_url ) &&
			! self::has_extension( $target_url );
	}

	/**
	 * Removes the base url path from the given URL.
	 *
	 * @param string $base_url The base URL that will be stripped.
	 * @param string $url      URL to remove the path from.
	 *
	 * @return string The URL without the base url
	 */
	public static function strip_base_url_path_from_url( $base_url, $url ) {
		$base_url_path = wp_parse_url( $base_url, PHP_URL_PATH );
		$base_url_path = ltrim( $base_url_path , '/' );

		if ( empty( $base_url_path ) ) {
			return $url;
		}

		$url = ltrim( $url, '/' );

		// When the url doesn't begin with the base url path.
		if ( stripos( trailingslashit( $url ), trailingslashit( $base_url_path ) ) !== 0 ) {
			return $url;
		}

		return substr( $url, strlen( $base_url_path ) );
	}
}

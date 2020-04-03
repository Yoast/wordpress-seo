<?php
/**
 * A helper object for urls.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Utils;

/**
 * Class Url_Helper
 */
class Url_Helper {

	/**
	 * Retrieve home URL with proper trailing slash.
	 *
	 * @param string      $path   Path relative to home URL.
	 * @param string|null $scheme Scheme to apply.
	 *
	 * @codeCoverageIgnore - We have to write test when this method contains own code.
	 *
	 * @return string Home URL with optional path, appropriately slashed if not.
	 */
	public function home( $path = '', $scheme = null ) {
		return WPSEO_Utils::home_url( $path, $scheme );
	}

	/**
	 * Check whether a url is relative.
	 *
	 * @param string $url URL string to check.
	 *
	 * @codeCoverageIgnore - We have to write test when this method contains own code.
	 *
	 * @return bool True when url is relative.
	 */
	public function is_relative( $url ) {
		return WPSEO_Utils::is_url_relative( $url );
	}

	/**
	 * Gets the path from the passed URL.
	 *
	 * @param string $url The URL to get the path from.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @return string The path of the URL. Returns an empty string if URL parsing fails.
	 */
	public function get_url_path( $url ) {
		return (string) \wp_parse_url( $url, PHP_URL_PATH );
	}

	/**
	 * Determines the file extension of the given url.
	 *
	 * @param string $url The URL.
	 *
	 * @return string The extension.
	 */
	public function get_extension_from_url( $url ) {
		$path = $this->get_url_path( $url );

		if ( $path === '' ) {
			return '';
		}

		$parts = \explode( '.', $path );
		if ( empty( $parts ) || count( $parts ) === 1 ) {
			return '';
		}

		return \end( $parts );
	}

	/**
	 * Ensures that the given url is an absolute url.
	 *
	 * @param string $url The url that needs to be absolute.
	 *
	 * @return string The absolute url.
	 */
	public function ensure_absolute_url( $url ) {
		if ( ! is_string( $url ) || $url === '' ) {
			return $url;
		}

		if ( $this->is_relative( $url ) === true ) {
			return $this->build_absolute_url( $url );
		}

		return $url;
	}

	/**
	 * Parse the home URL setting to find the base URL for relative URLs.
	 *
	 * @param string $path Optional path string.
	 *
	 * @return string
	 */
	public function build_absolute_url( $path = null ) {
		$path      = \wp_parse_url( $path, PHP_URL_PATH );
		$url_parts = \wp_parse_url( \home_url() );

		$base_url = \trailingslashit( $url_parts['scheme'] . '://' . $url_parts['host'] );

		if ( ! \is_null( $path ) ) {
			$base_url .= \ltrim( $path, '/' );
		}

		return $base_url;
	}
}

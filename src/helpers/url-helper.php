<?php
/**
 * A helper object for urls.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\Free\Helpers;

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
	 * @return bool True when url is relative.
	 */
	public function is_relative( $url ) {
		return WPSEO_Utils::is_url_relative( $url );
	}

	/**
	 * Get the relative path of the image.
	 *
	 * @param string $url Image URL.
	 *
	 * @return string The expanded image URL.
	 */
	public function get_relative_path( $url ) {
		if ( $url[0] !== '/' ) {
			return $url;
		}

		/*
			If it's a relative URL, it's relative to the domain, not necessarily to the WordPress install, we
			want to preserve domain name and URL scheme (http / https) though.
		*/
		$parsed_url = \wp_parse_url( \home_url() );
		$url        = $parsed_url['scheme'] . '://' . $parsed_url['host'] . $url;

		return $url;
	}
}

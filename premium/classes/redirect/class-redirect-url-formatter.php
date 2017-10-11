<?php
/**
 * @package WPSEO\Premium\Classes
 */

/**
 * Class representing a formatter for an URL.
 */
class WPSEO_Redirect_Url_Formatter {

	/** @var string  */
	protected $url = '';

	/**
	 * Sets the URL used for formatting.
	 *
	 * @param string $url The URL to format.
	 */
	public function __construct( $url ) {
		$this->url = $this->sanitize_url( $url );
	}

	/**
	 * We want to strip the subdirectory from the redirect url.
	 *
	 * @param string $home_url The URL to use as the base.
	 *
	 * @return string
	 */
	public function format_without_subdirectory( $home_url ) {
		$subdirectory = $this->get_subdirectory( $home_url );

		if ( ! empty( $subdirectory ) ) {
			$subdirectory  = trailingslashit( $subdirectory );
			$path_position = strpos( $this->url, $subdirectory );
			if ( $path_position === 0 ) {
				return '/' . $this->sanitize_url( substr( $this->url, strlen( $subdirectory ) ) );
			}
		}

		return '/' . $this->url;
	}

	/**
	 * Removes the slashes at the beginning of an url.
	 *
	 * @param string $url The URL to sanitize.
	 *
	 * @return string
	 */
	protected function sanitize_url( $url ) {
		return ltrim( $url, '/' );
	}

	/**
	 * Returns the subdirectory from the given URL.
	 *
	 * @param string $url The URL to get the subdirectory for.
	 *
	 * @return string
	 */
	protected function get_subdirectory( $url ) {
		// @todo Replace with call to wp_parse_url() once minimum requirement has gone up to WP 4.7.
		return $this->sanitize_url( parse_url( $url, PHP_URL_PATH ) );
	}
}

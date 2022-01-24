<?php

namespace Yoast\WP\SEO\Sanitizers;

/**
 * The URL sanitizer class.
 */
class Url_Sanitizer implements Sanitizer_Interface {

	/**
	 * Sanitizes a value.
	 *
	 * @param mixed $value The value to sanitize.
	 *
	 * @return string The sanitized URL.
	 */
	public function sanitize( $value ) {
		if ( ! \is_string( $value ) ) {
			return '';
		}

		$url = \trim( \htmlspecialchars( $value, ENT_COMPAT, $this->get_charset(), true ) );

		return \WPSEO_Utils::sanitize_url( $url );
	}

	/**
	 * Retrieves the site's charset. Defaults to UTF-8.
	 *
	 * @return string
	 */
	protected function get_charset() {
		return \get_bloginfo( 'charset' );
	}
}

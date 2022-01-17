<?php

namespace Yoast\WP\SEO\Sanitizers;

/**
 * The URL sanitizer class.
 */
class URL_Sanitizer implements Sanitizer_Interface {

	/**
	 * Sanitizes a value.
	 *
	 * @param mixed $value The value to sanitize.
	 *
	 * @return string The sanitized URL.
	 */
	public function sanitize( $value ) {
		return \WPSEO_Utils::sanitize_url( $value );
	}
}

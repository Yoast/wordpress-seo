<?php

namespace Yoast\WP\SEO\Sanitizers;

/**
 * The boolean sanitizer class.
 */
class Boolean_Sanitizer implements Sanitizer_Interface {

	/**
	 * Sanitizes a value.
	 *
	 * @param mixed $value The value to sanitize.
	 *
	 * @return bool The sanitized boolean.
	 */
	public function sanitize( $value ) {
		return \WPSEO_Utils::validate_bool( $value );
	}
}

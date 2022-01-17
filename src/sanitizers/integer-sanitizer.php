<?php

namespace Yoast\WP\SEO\Sanitizers;

/**
 * The integer sanitizer class.
 */
class Integer_Sanitizer implements Sanitizer_Interface {

	/**
	 * Sanitizes a value.
	 *
	 * @param mixed $value The value to sanitize.
	 *
	 * @return int The sanitized integer.
	 */
	public function sanitize( $value ) {
		return \WPSEO_Utils::validate_int( $value );
	}
}

<?php

namespace Yoast\WP\SEO\Sanitizers;

/**
 * The text sanitizer class.
 */
class Text_Sanitizer implements Sanitizer_Interface {

	/**
	 * Sanitizes a value.
	 *
	 * @param mixed $value The value to sanitize.
	 *
	 * @return string The sanitized text.
	 */
	public function sanitize( $value ) {
		return sanitize_text_field( $value );
	}
}

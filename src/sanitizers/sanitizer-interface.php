<?php

namespace Yoast\WP\SEO\Sanitizers;

/**
 * The sanitizer interface.
 */
interface Sanitizer_Interface {

	/**
	 * Sanitizes a value.
	 *
	 * @param mixed $value The value to sanitize.
	 *
	 * @return mixed The sanitized value.
	 */
	public function sanitize( $value );
}

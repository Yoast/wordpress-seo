<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for string operations.
 */
class String_Helper {

	/**
	 * Strips all HTML tags including script and style.
	 *
	 * @param string $string The string to strip the tags from.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @return string The processed string.
	 */
	public function strip_all_tags( $string ) {
		return \wp_strip_all_tags( $string );
	}

	/**
	 * Recursively trim whitespace round a string value or of string values within an array.
	 * Only trims strings to avoid typecasting a variable (to string).
	 *
	 * @param mixed $value Value to trim or array of values to trim.
	 *
	 * @return mixed Trimmed value or array of trimmed values.
	 */
	public function trim_recursive( $value ) {
		if ( is_string( $value ) ) {
			$value = trim( $value );
		}
		elseif ( is_array( $value ) ) {
			$value = array_map( [ __CLASS__, 'trim_recursive' ], $value );
		}

		return $value;
	}
}

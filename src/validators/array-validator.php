<?php

namespace Yoast\WP\SEO\Validators;

/**
 * The array validator class.
 */
class Array_Validator implements Validator_Interface {

	/**
	 * Validates if a value is an array.
	 *
	 * @param mixed $value The value to validate.
	 *
	 * @return bool Whether the value is an array.
	 */
	public function validate( $value ) {
		return \is_array( $value );
	}
}

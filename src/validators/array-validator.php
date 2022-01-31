<?php

namespace Yoast\WP\SEO\Validators;

/**
 * The array validator class.
 */
class Array_Validator implements Validator_Interface {

	/**
	 * Validates if a value is an array.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @return bool Whether the value is an array.
	 */
	public function validate( $value, array $settings = null ) {
		return \is_array( $value );
	}
}

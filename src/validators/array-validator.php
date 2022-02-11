<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;

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
	 * @throws Invalid_Type_Exception When the type of the value is not an array.
	 *
	 * @return array A valid array.
	 */
	public function validate( $value, array $settings = null ) {
		if ( ! \is_array( $value ) ) {
			throw new Invalid_Type_Exception( \gettype( $value ), 'array' );
		}

		return $value;
	}
}

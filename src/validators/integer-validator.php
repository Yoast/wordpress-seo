<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;

/**
 * The integer validator class.
 */
class Integer_Validator implements Validator_Interface {

	/**
	 * Validates if a value is an integer.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Invalid_Type_Exception When the type of the value is not an integer.
	 *
	 * @return int A valid integer.
	 */
	public function validate( $value, array $settings = null ) {
		$integer = \filter_var( $value, FILTER_VALIDATE_INT, FILTER_NULL_ON_FAILURE );

		if ( $integer === null ) {
			throw new Invalid_Type_Exception( \gettype( $value ), 'integer' );
		}

		return $integer;
	}
}

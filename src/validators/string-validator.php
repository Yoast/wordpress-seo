<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;

/**
 * The string validator class.
 */
class String_Validator implements Validator_Interface {

	/**
	 * Validates if a value is a string.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Invalid_Type_Exception When the type of the value is not a string.
	 *
	 * @return string A valid string.
	 */
	public function validate( $value, array $settings = null ) {
		if ( ! \is_string( $value ) ) {
			throw new Invalid_Type_Exception( \gettype( $value ), 'string' );
		}

		return $value;
	}
}

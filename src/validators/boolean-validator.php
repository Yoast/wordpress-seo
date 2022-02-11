<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception;

/**
 * The boolean validator class.
 */
class Boolean_Validator implements Validator_Interface {

	/**
	 * Validates if a value is a boolean.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Invalid_Type_Exception When the type of the value is not a boolean.
	 *
	 * @return bool A valid boolean.
	 */
	public function validate( $value, array $settings = null ) {
		$bool = \filter_var( $value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE );

		if ( $bool === null ) {
			throw new Invalid_Type_Exception( \gettype( $value ), 'boolean' );
		}

		return $bool;
	}
}

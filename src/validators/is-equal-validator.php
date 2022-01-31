<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Value_Exception;

/**
 * The is equal validator class.
 */
class Is_Equal_Validator implements Validator_Interface {

	/**
	 * Validates if a value equals another.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Invalid_Value_Exception When the value does not equal the expected value.
	 *
	 * @return mixed The valid value.
	 */
	public function validate( $value, array $settings = null ) {
		if ( $settings === null || ! \array_key_exists( 'equals', $settings ) ) {
			return $value;
		}

		if ( $value !== $settings['equals'] ) {
			throw new Invalid_Value_Exception();
		}

		return $value;
	}
}

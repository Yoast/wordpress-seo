<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Not_In_Array_Exception;

/**
 * The in array validator class.
 */
class In_Array_Validator implements Validator_Interface {

	/**
	 * The setting' allow-list key.
	 *
	 * @var string
	 */
	const ALLOW_KEY = 'allow';

	/**
	 * The setting' provider key.
	 *
	 * @var string
	 */
	const PROVIDER_KEY = 'provider';

	/**
	 * Validates if a value is in the allow-list.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Missing_Settings_Key_Exception When settings are missing.
	 * @throws Not_In_Array_Exception When the value is not in the allow-list.
	 *
	 * @return mixed A valid value.
	 */
	public function validate( $value, array $settings = null ) {
		if ( $settings === null || ! \array_key_exists( self::ALLOW_KEY, $settings ) ) {
			throw new Missing_Settings_Key_Exception( self::ALLOW_KEY );
		}

		if ( ! \in_array( $value, $settings[ self::ALLOW_KEY ], true ) ) {
			throw new Not_In_Array_Exception( $settings[ self::ALLOW_KEY ] );
		}

		return $value;
	}
}

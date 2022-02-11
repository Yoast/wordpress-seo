<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Empty_String_Exception;

/**
 * The empty string validator class.
 */
class Empty_String_Validator extends String_Validator {

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Reason: The parent validate can throw too.

	/**
	 * Validates if a value is a string.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Invalid_Empty_String_Exception When the value is not an empty string.
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception When the value is not a string.
	 *
	 * @return string A valid string.
	 */
	public function validate( $value, array $settings = null ) {
		$string = parent::validate( $value );

		if ( $string !== '' ) {
			throw new Invalid_Empty_String_Exception( $value );
		}

		return $string;
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}

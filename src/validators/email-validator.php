<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Invalid_Email_Exception;

/**
 * The Email validator class.
 */
class Email_Validator extends String_Validator {

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Reason: The parent validate can throw too.

	/**
	 * Validates if a value is an email.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Invalid_Email_Exception When the value is an invalid email address.
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception When the value is not a string.
	 *
	 * @return string A valid email address.
	 */
	public function validate( $value, array $settings = null ) {
		$email = parent::validate( $value );

		$email = \sanitize_email( $email );
		$email = \is_email( $email );
		if ( ! $email ) {
			throw new Invalid_Email_Exception( $value );
		}

		return $email;
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}

<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Not_In_Array_Exception;

/**
 * The in array keys validator class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Validator should not count.
 */
class In_Array_Keys_Validator extends In_Array_Validator {

	/**
	 * The setting' allow-list key.
	 *
	 * @var string
	 */
	const ALLOW_KEY = 'allow';

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Reason: The parent validate can throw too.

	/**
	 * Validates if a value is in the allow-list (as a key).
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

		$settings[ self::ALLOW_KEY ] = \array_keys( $settings[ self::ALLOW_KEY ] );

		return parent::validate( $value, $settings );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}

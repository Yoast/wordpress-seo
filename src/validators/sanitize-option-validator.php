<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;

/**
 * The sanitize option validator class.
 */
class Sanitize_Option_Validator implements Validator_Interface {

	/**
	 * The setting' option key.
	 *
	 * @var string
	 */
	const OPTION_KEY = 'option';

	/**
	 * Calls WordPress `sanitize_option`.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings The settings.
	 *
	 * @throws Missing_Settings_Key_Exception When settings are missing.
	 *
	 * @return string A valid string.
	 */
	public function validate( $value, array $settings = null ) {
		if ( $settings === null || ! \array_key_exists( self::OPTION_KEY, $settings ) ) {
			throw new Missing_Settings_Key_Exception( self::OPTION_KEY );
		}

		return \sanitize_option( $settings[ self::OPTION_KEY ], $value );
	}
}

<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;
use Yoast\WP\SEO\Exceptions\Validation\No_Regex_Match_Exception;

/**
 * The regex validator class.
 */
class Regex_Validator implements Validator_Interface {

	/**
	 * The setting' pattern key.
	 *
	 * @var string
	 */
	const PATTERN_KEY = 'pattern';

	/**
	 * Validates if a value matches a regex.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws Missing_Settings_Key_Exception When settings are missing.
	 * @throws No_Regex_Match_Exception When the value does not match a regex.
	 *
	 * @return mixed The valid value.
	 */
	public function validate( $value, array $settings = null ) {
		if ( $settings === null || ! \array_key_exists( self::PATTERN_KEY, $settings ) ) {
			throw new Missing_Settings_Key_Exception( self::PATTERN_KEY );
		}

		if ( \preg_match( $settings[ self::PATTERN_KEY ], $value ) !== 1 ) {
			throw new No_Regex_Match_Exception( $settings[ self::PATTERN_KEY ] );
		}

		return $value;
	}
}

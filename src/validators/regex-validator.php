<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception;
use Yoast\WP\SEO\Exceptions\Validation\No_Regex_Groups_Exception;
use Yoast\WP\SEO\Exceptions\Validation\No_Regex_Match_Exception;

/**
 * The regex validator class.
 */
class Regex_Validator extends String_Validator {

	/**
	 * The setting' pattern key.
	 *
	 * @var string
	 */
	const PATTERN_KEY = 'pattern';

	/**
	 * The setting' groups key.
	 *
	 * @var string
	 */
	const GROUPS_KEY = 'groups';

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Reason: The parent validate can throw too.

	/**
	 * Validates if a value matches a regex.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception When the value is not a string.
	 * @throws Missing_Settings_Key_Exception When settings are missing.
	 * @throws No_Regex_Match_Exception When the value does not match a regex.
	 * @throws No_Regex_Groups_Exception When the matches do not contain any of the specified groups.
	 *
	 * @return string The valid value.
	 */
	public function validate( $value, array $settings = null ) {
		$string = parent::validate( $value );

		if ( $settings === null || ! \array_key_exists( self::PATTERN_KEY, $settings ) ) {
			throw new Missing_Settings_Key_Exception( self::PATTERN_KEY );
		}

		if ( \preg_match( $settings[ self::PATTERN_KEY ], $string, $matches ) !== 1 ) {
			throw new No_Regex_Match_Exception( $string, $settings[ self::PATTERN_KEY ] );
		}

		// If no groups are specified, this is the match.
		if ( ! \array_key_exists( self::GROUPS_KEY, $settings ) ) {
			return $string;
		}

		// If a group is specified, try to change the value to the matched group.
		foreach ( $settings[ self::GROUPS_KEY ] as $group ) {
			// Filter out groups that don't exist or matched an empty string.
			if ( \array_key_exists( $group, $matches ) && $matches[ $group ] !== '' ) {
				return $matches[ $group ];
			}
		}

		throw new No_Regex_Groups_Exception( $string, $settings[ self::PATTERN_KEY ] );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}

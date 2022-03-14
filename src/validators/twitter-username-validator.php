<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception;
use Yoast\WP\SEO\Exceptions\Validation\Invalid_Twitter_Username_Exception;

/**
 * The Twitter username validator class.
 */
class Twitter_Username_Validator extends Text_Field_Validator {

	/**
	 * Holds the regex validator instance.
	 *
	 * @var Regex_Validator
	 */
	protected $regex_validator;

	/**
	 * Constructs a verification validator instance.
	 *
	 * @param Regex_Validator $regex_validator The regex validator.
	 */
	public function __construct( Regex_Validator $regex_validator ) {
		$this->regex_validator = $regex_validator;
	}

	// phpcs:disable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber -- Reason: The parent validate can throw too.

	/**
	 * Validates if a value is a Twitter username.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception When the type of the value is not a string.
	 * @throws Invalid_Twitter_Username_Exception When the value is not a valid Twitter username.
	 *
	 * @return string A valid string.
	 */
	public function validate( $value, array $settings = null ) {
		$string = parent::validate( $value );

		$twitter_username = \ltrim( $string, '@' );

		try {
			return $this->regex_validator->validate(
				$twitter_username,
				[ 'pattern' => '`^[A-Za-z0-9_]{1,25}$`' ]
			);
		} catch ( Abstract_Validation_Exception $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
		}

		try {
			return $this->regex_validator->validate(
				$twitter_username,
				[
					'pattern' => '`^http(?:s)?://(?:www\.)?twitter\.com/(?P<handle>[A-Za-z0-9_]{1,25})/?$`',
					'groups'  => [ 'handle' ],
				]
			);
		} catch ( Abstract_Validation_Exception $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
		}

		throw new Invalid_Twitter_Username_Exception( $string );
	}

	// phpcs:enable Squiz.Commenting.FunctionCommentThrowTag.WrongNumber
}

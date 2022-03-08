<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception;

/**
 * The verification validator class.
 */
class Verification_Validator extends String_Validator {

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

	/**
	 * Validates if a value is a verification, using two regex validations.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings The settings. Expects Regex_Validator::PATTERN_KEY and Regex_Validator::GROUPS_KEY.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Invalid_Type_Exception When the value is not a string.
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Missing_Settings_Key_Exception When settings are missing.
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\No_Regex_Match_Exception When the value does not match a regex.
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\No_Regex_Groups_Exception When the matches do not contain any of the
	 *                                                                       specified groups.
	 * @return string The valid value.
	 */
	public function validate( $value, array $settings = null ) {
		$string = parent::validate( $value );

		// Make sure we only have the real key, not a complete meta tag.
		if ( \strpos( $string, 'content=' ) ) {
			try {
				$string = $this->regex_validator->validate(
					$string,
					[
						'pattern' => '`content=([\'"])?([^\'"> ]+)(?:\1|[ />])`',
						'groups'  => [ 2 ],
					]
				);
			} catch ( Abstract_Validation_Exception $e ) { // phpcs:ignore Generic.CodeAnalysis.EmptyStatement.DetectedCatch -- Deliberately left empty.
				// Ignore meta tag validation failure to validate it as the real key.
			}
		}

		// Sanitize the string.
		$string = \sanitize_text_field( $string );

		// Sanitize as a regex.
		return $this->regex_validator->validate( $string, $settings );
	}
}

<?php

namespace Yoast\WP\SEO\Validators\Search_Engine_Verify;

use Yoast\WP\SEO\Validators\Validator_Interface;
use Yoast\WP\SEO\Values\Validation_Error;

/**
 * Class Search_Engine_Verify_Validator.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- 4 words is fine.
 */
abstract class Search_Engine_Verify_Validator implements Validator_Interface {

	/**
	 * Validate the search engine verification value against a specific regex.
	 *
	 * @param mixed $value The value that needs to be validated.
	 *
	 * @return bool|Validation_Error For an invalid value a Validation_Error will be returned, or true when the value is valid.
	 */
	public function validate( $value ) {
		return $this->validate_against_regex( $value, $this->get_validation_regex() );
	}

	/**
	 * Validate the verification value against a regex.
	 *
	 * @param mixed  $value The value that needs to be validated.
	 * @param string $regex The regex that should be used to validate the value.
	 *
	 * @return bool|Validation_Error For an invalid value a Validation_Error will be returned, or true when the value is valid.
	 */
	protected function validate_against_regex( $value, $regex ) {
		if ( preg_match( $regex, $value ) !== 1 ) {
			return new Validation_Error(
				sprintf(
					/* translators: 1: Verification string from user input; 2: Search engine name. */
					\__( '%1$s does not seem to be a valid %2$s verification string. Please correct.', 'wordpress-seo' ),
					'<strong>' . esc_html( $value ) . '</strong>',
					$this->get_search_engine_name()
				)
			);
		}

		return true;
	}

	/**
	 * Get the name of the search engine for which the verification code is validated.
	 *
	 * @return string The name of the search engine.
	 */
	abstract protected function get_search_engine_name();

	/**
	 * Get the regex to validate the verification code against.
	 *
	 * @return string The regex to use for validation.
	 */
	abstract protected function get_validation_regex();
}

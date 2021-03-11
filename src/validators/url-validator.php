<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Values\Validation_Error;

/**
 * Class Url_Validator.
 */
class Url_Validator implements Validator_Interface {

	/**
	 * Validate that the given value is a correct url.
	 *
	 * @param mixed $value The value that needs to be validated.
	 *
	 * @return Validation_Error|bool For an invalid value a Validation_Error will be returned, or true when the value is valid.
	 */
	public function validate( $value ) {
		$validated_url = filter_var( $value, FILTER_VALIDATE_URL );

		if ( $validated_url === false ) {
			return new Validation_Error(
				sprintf(
					/* translators: %s expands to an invalid URL. */
					\__( '%s does not seem to be a valid url. Please correct.', 'wordpress-seo' ),
					'<strong>' . \esc_html( $value ) . '</strong>'
				)
			);
		}

		return true;
	}
}

<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Invalid email validation exception class.
 */
class Invalid_Email_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs an invalid email validation exception instance.
	 *
	 * @param mixed $value The value that is not an email address.
	 */
	public function __construct( $value ) {
		parent::__construct(
			\sprintf(
			/* translators: %s expands to an invalid email address. */
				\esc_html__( '%s does not seem to be a valid email address.', 'wordpress-seo' ),
				'<strong>' . \esc_html( $value ) . '</strong>'
			)
		);
	}
}

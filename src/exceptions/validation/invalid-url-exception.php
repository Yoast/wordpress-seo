<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Invalid URL validation exception class.
 */
class Invalid_Url_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs an invalid URL validation exception instance.
	 *
	 * @param mixed $value The value that is not a URL.
	 */
	public function __construct( $value ) {
		parent::__construct(
			\sprintf(
			/* translators: %s expands to an invalid URL. */
				\esc_html__( '%s does not seem to be a valid url. Please correct.', 'wordpress-seo' ),
				'<strong>' . \esc_html( $value ) . '</strong>'
			)
		);
	}
}

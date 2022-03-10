<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Invalid Twitter username validation exception class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- 4 words is fine.
 */
class Invalid_Twitter_Username_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs an invalid Twitter username validation exception instance.
	 *
	 * @param mixed $value The value that is not a valid Twitter username.
	 */
	public function __construct( $value ) {
		parent::__construct(
			\sprintf(
			/* translators: %s expands to an invalid Twitter username. */
				\esc_html__( '%s does not seem to be a valid Twitter Username. Please correct.', 'wordpress-seo' ),
				'<strong>' . \esc_html( $value ) . '</strong>'
			)
		);
	}
}

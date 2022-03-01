<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * No regex match validation exception class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Exception is not part of the name.
 */
class No_Regex_Match_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs a no regex match validation exception instance.
	 *
	 * @param string $value   The input value.
	 * @param string $pattern The regex pattern.
	 */
	public function __construct( $value, $pattern ) {
		parent::__construct(
			\sprintf(
			/* translators: %1$s expands to the user input. %2$s expands to a regular expression pattern. */
				\esc_html__( '%1$s does not conform to the pattern %2$s.', 'wordpress-seo' ),
				'<strong>' . \esc_html( $value ) . '</strong>',
				'<strong>' . \esc_html( $pattern ) . '</strong>'
			)
		);
	}
}

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
	 * @param string $pattern The regex pattern.
	 */
	public function __construct( $pattern ) {
		parent::__construct(
			\sprintf(
			/* translators: %s expands to a regular expression pattern. */
				\esc_html__( 'The value does not conform to the pattern %s.', 'wordpress-seo' ),
				'<strong>' . \esc_html( $pattern ) . '</strong>'
			)
		);
	}
}

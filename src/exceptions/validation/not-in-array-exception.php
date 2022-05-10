<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Not in array validation exception class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Exception should not count.
 */
class Not_In_Array_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs a not in array validation exception instance.
	 *
	 * @param array $allow The values that are allowed.
	 */
	public function __construct( $allow ) {
		parent::__construct(
			\sprintf(
			/* translators: %s expands to a list of values that are allowed. */
				\esc_html__( 'Please change the value to be one of: %s.', 'wordpress-seo' ),
				'<strong>' . \esc_html( \YoastSEO()->helpers->json->format_encode( $allow ) ) . '</strong>'
			)
		);
	}
}

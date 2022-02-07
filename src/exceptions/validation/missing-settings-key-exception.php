<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Missing settings key validation exception class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Exception is not part of the name.
 */
class Missing_Settings_Key_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs a missing settings key validation exception instance.
	 *
	 * @param string $key The missing settings key.
	 */
	public function __construct( $key ) {
		parent::__construct(
			\sprintf(
			/* translators: %s expands to the missing settings key. */
				\esc_html__( 'The validation failed because configuration is missing: %s.', 'wordpress-seo' ),
				'<strong>' . \esc_html( $key ) . '</strong>'
			)
		);
	}
}

<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Invalid blog ID validation exception class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Exception is not part of the name.
 */
class Invalid_Blog_ID_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs an invalid blog ID validation exception instance.
	 *
	 * @param integer $value The value that is an invalid blog ID.
	 */
	public function __construct( $value ) {
		parent::__construct(
			\sprintf(
			/* translators: %s expands to a not existing blog id. */
				\esc_html__( 'This must be an existing blog. Blog %s does not exist or has been marked as deleted.', 'wordpress-seo' ),
				'<strong>' . \esc_html( $value ) . '</strong>'
			)
		);
	}
}

<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Invalid type validation exception class.
 */
class Invalid_Type_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs an invalid URL type validation exception instance.
	 *
	 * @param string $detected_type The detected type.
	 * @param string $expected_type The expected type.
	 */
	public function __construct( $detected_type, $expected_type ) {
		parent::__construct(
			\sprintf(
			/* translators: %1$s expands to the detected type (e.g. array). %2$s expands to the expected type. */
				\esc_html__( 'The type "%1$s" is invalid. Please change to "%2$s".', 'wordpress-seo' ),
				$detected_type,
				$expected_type
			)
		);
	}
}

<?php

namespace Yoast\WP\SEO\Exceptions\Option;

/**
 * Unknown option exception class.
 */
class Unknown_Exception extends Abstract_Option_Exception {

	/**
	 * Creates exception for an option.
	 *
	 * @param string $name The option name.
	 *
	 * @return static Instance of the exception.
	 */
	public static function for_option( $name ) {
		return new static(
			\sprintf(
			/* translators: %s expands to the name of the option. */
				\esc_html__( 'Option "%s" does not exist.', 'wordpress-seo' ),
				\esc_html( $name )
			)
		);
	}
}

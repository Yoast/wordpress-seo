<?php

namespace Yoast\WP\SEO\Exceptions\Option;

/**
 * Unknown option exception class.
 */
class Unknown_Exception extends Abstract_Option_Exception {

	/**
	 * Constructs an unknown option exception instance.
	 *
	 * @param string $name The option name.
	 */
	public function __construct( $name ) {
		parent::__construct(
			\sprintf(
			/* translators: %s expands to the name of the option. */
				\esc_html__( 'Option "%s" does not exist.', 'wordpress-seo' ),
				\esc_html( $name )
			)
		);
	}
}

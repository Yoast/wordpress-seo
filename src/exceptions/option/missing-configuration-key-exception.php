<?php

namespace Yoast\WP\SEO\Exceptions\Option;

/**
 * Missing configuration key option exception class.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- 4 words is fine.
 */
class Missing_Configuration_Key_Exception extends Abstract_Option_Exception {

	/**
	 * Constructs a missing key option exception instance.
	 *
	 * @param string $name The option name.
	 * @param string $key  The missing key.
	 */
	public function __construct( $name, $key ) {
		parent::__construct(
			\sprintf(
			/* translators: %1$s expands to the name of the option. %2$s expands to the key that is missing. */
				\esc_html__( 'The configuration of option "%1$s" does not have the "%2$s" key.', 'wordpress-seo' ),
				\esc_html( $name ),
				$key
			)
		);
	}
}

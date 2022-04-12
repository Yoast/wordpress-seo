<?php

namespace Yoast\WP\SEO\Exceptions\Option;

/**
 * Save failed exception class.
 */
class Save_Failed_Exception extends Abstract_Option_Exception {

	/**
	 * Creates exception for an option.
	 *
	 * @param string $option_name The option name that failed to save.
	 *
	 * @return static Instance of the exception.
	 */
	public static function for_option( $option_name ) {
		return new static(
			\sprintf(
			/* translators: %1$s expands to the option name (database row) that failed to save. */
				\__( 'Failed to save the option (%1$s).', 'wordpress-seo' ),
				$option_name
			)
		);
	}
}

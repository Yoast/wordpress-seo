<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Invalid settings validation exception class.
 */
class Invalid_Settings_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs an invalid settings validation exception instance.
	 */
	public function __construct() {
		parent::__construct(
			\esc_html__(
				'The validation failed because the configuration\' settings are invalid.',
				'wordpress-seo'
			)
		);
	}
}

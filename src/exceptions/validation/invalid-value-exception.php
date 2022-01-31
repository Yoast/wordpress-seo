<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Invalid value validation exception class.
 */
class Invalid_Value_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs an invalid value validation exception instance.
	 */
	public function __construct() {
		parent::__construct( \esc_html__( 'The input value is not as expected.', 'wordpress-seo' ) );
	}
}

<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Invalid JSON validation exception class.
 */
class Invalid_Json_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs an invalid JSON validation exception instance.
	 */
	public function __construct() {
		parent::__construct( \esc_html__( 'Invalid JSON.', 'wordpress-seo' ) );
	}
}

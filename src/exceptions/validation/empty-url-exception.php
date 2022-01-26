<?php

namespace Yoast\WP\SEO\Exceptions\Validation;

/**
 * Empty URL validation exception class.
 */
class Empty_Url_Exception extends Abstract_Validation_Exception {

	/**
	 * Constructs an empty URL validation exception instance.
	 */
	public function __construct() {
		parent::__construct( \esc_html__( 'A url can not be empty. Please correct.', 'wordpress-seo' ) );
	}
}

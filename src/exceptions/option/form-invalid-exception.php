<?php

namespace Yoast\WP\SEO\Exceptions\Option;

use Exception;

/**
 * Form invalid exception class.
 */
class Form_Invalid_Exception extends Abstract_Option_Exception {

	/**
	 * Holds the field exceptions.
	 *
	 * @var Exception[]
	 */
	protected $field_exceptions;

	/**
	 * Constructs a single exception for one or more field exceptions.
	 *
	 * @param Exception[] $field_exceptions The field exceptions.
	 */
	public function __construct( array $field_exceptions ) {
		parent::__construct( \__( 'Form contains invalid fields.', 'wordpress-seo' ) );

		$this->field_exceptions = $field_exceptions;
	}

	/**
	 * Retrieves the field exceptions.
	 *
	 * @return Exception[] The field exceptions.
	 */
	public function get_field_exceptions() {
		return $this->field_exceptions;
	}
}

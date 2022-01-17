<?php

namespace Yoast\WP\SEO\Validators;

/**
 * The validator interface.
 */
interface Validator_Interface {

	/**
	 * Validates a value.
	 *
	 * @param mixed $value The value to validate.
	 *
	 * @return bool Whether the value is valid.
	 */
	public function validate( $value );
}

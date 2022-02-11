<?php

namespace Yoast\WP\SEO\Validators;

/**
 * The validator interface.
 */
interface Validator_Interface {

	/**
	 * Validates a value.
	 *
	 * @param mixed $value    The value to validate.
	 * @param array $settings Optional settings.
	 *
	 * @throws \Yoast\WP\SEO\Exceptions\Validation\Abstract_Validation_Exception When the value is "unfixable".
	 *
	 * @return mixed A valid value.
	 */
	public function validate( $value, array $settings = null );
}

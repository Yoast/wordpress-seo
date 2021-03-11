<?php

namespace Yoast\WP\SEO\Validators;

use Yoast\WP\SEO\Values\Validation_Error;

/**
 * Interface Validator_Interface.
 */
interface Validator_Interface {

	/**
	 * Validate the given value against a specific set of rules.
	 *
	 * @param mixed $value The value that needs to be validated.
	 *
	 * @return Validation_Error|bool For an invalid value a Validation_Error will be returned, or true when the value is valid.
	 */
	public function validate( $value );
}

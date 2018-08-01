<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Value object containing a validation error.
 */
class WPSEO_Validation_Error extends WPSEO_Validation_Result {

	/**
	 * Gets error as the validation result type.
	 *
	 * @return string
	 */
	public function get_type() {
		return 'error';
	}
}

<?php
/**
 * WPSEO Premium plugin file.
 *
 * @package WPSEO\Premium\Classes
 */

/**
 * Value object containing a validation warning.
 */
class WPSEO_Validation_Warning extends WPSEO_Validation_Result {

	/**
	 * Gets warning as the validation result type.
	 *
	 * @return string
	 */
	public function get_type() {
		return 'warning';
	}
}

<?php
/**
 * WPSEO interface file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Interface WPSEO_Endpoint_Validator
 */
interface WPSEO_Endpoint_Validator {

	/**
	 * Validates the passed request data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @return void
	 */
	public function validate( $request_data );
}

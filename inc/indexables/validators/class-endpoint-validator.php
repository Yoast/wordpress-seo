<?php

/**
 * WPSEO interface file.
 *
 * @package WPSEO\Internals
 */
interface WPSEO_Endpoint_Validator {

	/**
	 * Validates the passed request data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @return void
	 */
	public static function validate( $request_data );
}

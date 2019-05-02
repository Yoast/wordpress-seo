<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Robots_Validator.
 */
class WPSEO_Robots_Validator implements WPSEO_Endpoint_Validator {

	/**
	 * The robots keys to validate.
	 *
	 * @var array
	 */
	private $robots_to_validate = array(
		'is_robots_nofollow',
		'is_robots_noarchive',
		'is_robots_noimageindex',
		'is_robots_nosnippet',
		'is_robots_noindex',
	);

	/**
	 * Validates the passed request data.
	 *
	 * @param array $request_data The request data to validate.
	 *
	 * @return void
	 *
	 * @throws WPSEO_Invalid_Argument_Exception Thrown if the robots values are not a boolean type.
	 */
	public function validate( $request_data ) {
		foreach ( $this->robots_to_validate as $item ) {
			if ( ! WPSEO_Validator::key_exists( $request_data, $item ) ) {
				continue;
			}

			if ( ! is_null( $request_data[ $item ] ) && ! WPSEO_Validator::is_boolean( $request_data[ $item ] ) ) {
				throw WPSEO_Invalid_Argument_Exception::invalid_boolean_parameter( $request_data[ $item ], $item );
			}
		}
	}
}

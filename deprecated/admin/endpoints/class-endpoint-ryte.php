<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\OnPage
 */

/**
 * Represents an implementation of the WPSEO_Endpoint interface to register one or multiple endpoints.
 *
 * @deprecated xx.x
 * @codeCoverageIgnore
 */
class WPSEO_Endpoint_Ryte implements WPSEO_Endpoint {

	/**
	 * The namespace of the REST route.
	 *
	 * @var string
	 */
	const REST_NAMESPACE = 'yoast/v1';

	/**
	 * The route of the ryte endpoint.
	 *
	 * @var string
	 */
	const ENDPOINT_RETRIEVE = 'ryte';

	/**
	 * The name of the capability needed to retrieve data using the endpoints.
	 *
	 * @var string
	 */
	const CAPABILITY_RETRIEVE = 'manage_options';

	/**
	 * Constructs the WPSEO_Endpoint_Ryte class and sets the service to use.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Registers the REST routes that are available on the endpoint.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 */
	public function register() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}

	/**
	 * Determines whether or not data can be retrieved for the registered endpoints.
	 *
	 * @deprecated xx.x
	 * @codeCoverageIgnore
	 */
	public function can_retrieve_data() {
		_deprecated_function( __METHOD__, 'WPSEO xx.x' );
	}
}

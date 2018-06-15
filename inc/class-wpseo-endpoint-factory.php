<?php

/**
 * Class WPSEO_Endpoint_Factory
 */
class WPSEO_Endpoint_Factory {
	private $valid_http_methods = array(
		'GET',
		'PATCH',
		'POST',
		'PUT',
		'DELETE',
	);

	protected $args = array();

	public function __construct( $namespace, $endpoint, $callback, $permission_callback, $method ) {
		if ( empty( $namespace ) ) {
			throw WPSEO_Invalid_Argument_Exception::empty_parameter( 'namespace' );
		}

		if ( ! WPSEO_Validator::is_string( $namespace ) ) {
			throw WPSEO_Invalid_Argument_Exception::empty_parameter( 'namespace' );
		}

		$this->namespace = $namespace;

		if ( empty( $endpoint ) ) {
			throw WPSEO_Invalid_Argument_Exception::empty_parameter( 'endpoint' );
		}

		if ( ! WPSEO_Validator::is_string( $endpoint ) ) {
			throw WPSEO_Invalid_Argument_Exception::empty_parameter( 'endpoint' );
		}

		$this->endpoint = $endpoint;

		if ( ! is_callable( $callback ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_callable_parameter( $callback, 'callback' );
		}

		$this->callback = $callback;


	}

	protected function add_argument( $name, $description, $type, $required = true ) {
		
	}

	public function register() {
		register_rest_route( $this->namespace, $this->endpoint,
			array(
				'methods' => 'POST',
				'callback' => array(
					$this->service,
					'save_indexable',
				),
				'permission_callback' => $permissions_callback,
			)
		);
	}
}

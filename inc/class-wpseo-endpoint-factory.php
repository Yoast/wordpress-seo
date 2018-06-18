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

	private $namespace;
	private $endpoint;
	private $callback;
	private $permission_callback;
	private $method;

	public function __construct( $namespace, $endpoint, $callback, $permission_callback, $method = 'GET' ) {
		if ( ! WPSEO_Validator::is_string( $namespace ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $namespace, 'namespace' );
		}

		$this->namespace = $namespace;

		if ( ! WPSEO_Validator::is_string( $endpoint ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $endpoint, 'endpoint' );
		}

		$this->endpoint = $endpoint;

		if ( ! is_callable( $callback ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_callable_parameter( $callback, 'callback' );
		}

		$this->callback = $callback;

		if ( ! is_callable( $permission_callback ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_callable_parameter( $permission_callback, 'callback' );
		}

		$this->permission_callback = $permission_callback;

		if ( ! WPSEO_Validator::is_string( $method ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $method, 'method' );
		}

		$this->method = $this->validate_method( $method );
	}

	protected function validate_method( $method ) {
		if ( ! in_array( $method, $this->valid_http_methods, true ) ) {
			throw new \InvalidArgumentException( sprintf( '%s is not a valid HTTP method', $method ) );
		}

		return $method;
	}

	protected function add_argument( $name, $description, $type, $required = true ) {
		if ( ! WPSEO_Validator::is_string( $name ) ) {

		}
	}

	public function register() {
		register_rest_route( $this->namespace, $this->endpoint,
			array(
				'methods' => 'POST',
				'callback' => array(
					$this->service,
					'save_indexable',
				),
				'permission_callback' => $this->permissions_callback,
			)
		);
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 */

/**
 * Class WPSEO_Endpoint_Factory
 */
class WPSEO_Endpoint_Factory {

	/**
	 * @var array The valid HTTP methods.
	 */
	private $valid_http_methods = array(
		'GET',
		'PATCH',
		'POST',
		'PUT',
		'DELETE',
	);

	/**
	 * @var array The arguments.
	 */
	protected $args = array();

	/**
	 * @var string The namespace.
	 */
	private $namespace;

	/**
	 * @var string The endpoint URL.
	 */
	private $endpoint;

	/**
	 * @var callable The callback to execute if the endpoint is called.
	 */
	private $callback;

	/**
	 * @var callable The permission callback to execute to determine permissions.
	 */
	private $permission_callback;

	/**
	 * @var string The HTTP method to use.
	 */
	private $method;

	/**
	 * WPSEO_Endpoint_Factory constructor.
	 *
	 * @param string   $namespace           The endpoint's namespace.
	 * @param string   $endpoint            The endpoint's URL.
	 * @param callable $callback            The callback function to execute.
	 * @param callable $permission_callback The permission callback to execute to determine permissions.
	 * @param string   $method              The HTTP method to use. Defaults to GET.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception The invalid argument exception.
	 */
	public function __construct( $namespace, $endpoint, $callback, $permission_callback, $method = WP_REST_Server::READABLE ) {
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

		$this->method = $this->validate_method( $method );
	}

	/**
	 * Gets the associated arguments.
	 *
	 * @return array The arguments.
	 */
	public function get_arguments() {
		return $this->args;
	}

	/**
	 * Determines whether or not there are any arguments present.
	 *
	 * @return bool Whether or not any arguments are present.
	 */
	public function has_arguments() {
		return count( $this->args ) > 0;
	}

	/**
	 * Registers the endpoint with WordPress.
	 *
	 * @return void
	 */
	public function register() {
		$config = array(
			'methods'             => $this->method,
			'callback'            => $this->callback,
			'permission_callback' => $this->permission_callback,
		);

		if ( $this->has_arguments() ) {
			$config['args'] = $this->args;
		}

		register_rest_route( $this->namespace, $this->endpoint, $config );
	}

	/**
	 * Validates the method parameter.
	 *
	 * @param string $method The set method parameter.
	 *
	 * @return string The validated method.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception The invalid argument exception.
	 * @throws InvalidArgumentException         The invalid argument exception.
	 */
	protected function validate_method( $method ) {
		if ( ! WPSEO_Validator::is_string( $method ) ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_string_parameter( $method, 'method' );
		}

		if ( ! in_array( $method, $this->valid_http_methods, true ) ) {
			throw new InvalidArgumentException( sprintf( '%s is not a valid HTTP method', $method ) );
		}

		return $method;
	}

	/**
	 * Adds an argument to the endpoint.
	 *
	 * @param string $name        The name of the argument.
	 * @param string $description The description associated with the argument.
	 * @param string $type        The type of value that can be assigned to the argument.
	 * @param bool   $required    Whether or not it's a required argument. Defaults to true.
	 *
	 * @return void
	 */
	protected function add_argument( $name, $description, $type, $required = true ) {
		if ( in_array( $name, array_keys( $this->args ), true ) ) {
			return;
		}

		$this->args[ $name ] = array(
			'description' => $description,
			'type'        => $type,
			'required'    => $required,
		);
	}
}

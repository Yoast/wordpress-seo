<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Service
 */
class WPSEO_Configuration_Service {

	/** @var WPSEO_Configuration_Storage */
	private $storage;

	/** @var WPSEO_Configuration_Endpoint */
	private $endpoint;

	/** @var WPSEO_Configuration_Options_Adapter */
	private $adapter;

	/**
	 * WPSEO_Configuration_Service constructor.
	 *
	 * Set default handlers
	 */
	public function __construct() {

		// We can't do anything when requirements are not met.
		if ( ! defined( 'REST_API_VERSION' ) || version_compare( REST_API_VERSION, '2.0', '<' ) ) {
			return;
		}

		$this->storage   = new WPSEO_Configuration_Storage();
		$this->endpoint  = new WPSEO_Configuration_Endpoint();
		$this->adapter   = new WPSEO_Configuration_Options_Adapter();
		$this->structure = new WPSEO_Configuration_Structure();
		$this->components = new WPSEO_Configuration_Components();
	}

	public function register_hooks() {
		add_action( 'rest_api_init', array( $this, 'initialize' ) );
	}

	/**
	 * Register the service and boot handlers
	 */
	public function initialize() {
		$this->endpoint->set_service( $this );
		$this->endpoint->register();

		$this->storage->set_adapter( $this->adapter );
		$this->components->set_storage( $this->storage );
	}

	/**
	 * Set storage handler
	 *
	 * @param WPSEO_Configuration_Storage $storage
	 */
	public function set_storage( WPSEO_Configuration_Storage $storage ) {
		$this->storage = $storage;
	}

	/**
	 * Set endpoint handler
	 *
	 * @param WPSEO_Configuration_Endpoint $endpoint
	 */
	public function set_endpoint( WPSEO_Configuration_Endpoint $endpoint ) {
		$this->endpoint = $endpoint;
	}

	public function set_options_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$this->adapter = $adapter;
	}

	/**
	 * Used by endpoint to retrieve configuration
	 *
	 * @return array List of settings.
	 */
	public function get_configuration() {
		$fields            = $this->storage->retrieve();
		$steps             = $this->structure->retrieve();

		// Custom Components?
		return array(
			'fields'           => $fields,
			'steps'            => $steps
		);
	}

	/**
	 * Used by endpoint to store changes
	 *
	 * @param array $data List of settings.
	 *
	 * @return array List of feedback per option if saving succeeded.
	 */
	public function set_configuration( $data ) {
		return $this->storage->store( $data );
	}

}

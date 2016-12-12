<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Service
 */
class WPSEO_Configuration_Service {

	/** @var WPSEO_Configuration_Structure */
	protected $structure;

	/** @var WPSEO_Configuration_Components */
	protected $components;

	/** @var WPSEO_Configuration_Storage */
	protected $storage;

	/** @var WPSEO_Configuration_Endpoint */
	protected $endpoint;

	/** @var WPSEO_Configuration_Options_Adapter */
	protected $adapter;

	/**
	 * Hook into the REST API and switch language.
	 */
	public function initialize() {
		// Switch to the user locale with fallback to the site locale.
		if ( function_exists( 'switch_to_locale' ) ) {
			switch_to_locale( WPSEO_Utils::get_user_locale() );
		}

		// Make sure we have our translations available.
		wpseo_load_textdomain();

		$this->set_default_providers();
		$this->populate_configuration();
		$this->endpoint->register();

		// @todo: check if this is really needed, since the switch happens only in the API.
		if ( function_exists( 'restore_current_locale' ) ) {
			restore_current_locale();
		}
	}

	/**
	 * Set default handlers
	 */
	public function set_default_providers() {
		$this->set_storage( new WPSEO_Configuration_Storage() );
		$this->set_options_adapter( new WPSEO_Configuration_Options_Adapter() );
		$this->set_components( new WPSEO_Configuration_Components() );
		$this->set_endpoint( new WPSEO_Configuration_Endpoint() );
		$this->set_structure( new WPSEO_Configuration_Structure() );
	}

	/**
	 * Set storage handler
	 *
	 * @param WPSEO_Configuration_Storage $storage Storage handler to use.
	 */
	public function set_storage( WPSEO_Configuration_Storage $storage ) {
		$this->storage = $storage;
	}

	/**
	 * Set endpoint handler
	 *
	 * @param WPSEO_Configuration_Endpoint $endpoint Endpoint implementation to use.
	 */
	public function set_endpoint( WPSEO_Configuration_Endpoint $endpoint ) {
		$this->endpoint = $endpoint;
		$this->endpoint->set_service( $this );
	}

	/**
	 * Set the options adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to use.
	 */
	public function set_options_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$this->adapter = $adapter;
	}

	/**
	 * Set components provider
	 *
	 * @param WPSEO_Configuration_Components $components Component provider to use.
	 */
	public function set_components( WPSEO_Configuration_Components $components ) {
		$this->components = $components;
	}

	/**
	 * Set structure provider
	 *
	 * @param WPSEO_Configuration_Structure $structure Structure provider to use.
	 */
	public function set_structure( WPSEO_Configuration_Structure $structure ) {
		$this->structure = $structure;
	}

	/**
	 * Populate the configuration
	 */
	protected function populate_configuration() {
		$this->storage->set_adapter( $this->adapter );
		$this->storage->add_default_fields();

		$this->components->initialize();
		$this->components->set_storage( $this->storage );
	}

	/**
	 * Used by endpoint to retrieve configuration
	 *
	 * @return array List of settings.
	 */
	public function get_configuration() {
		$fields = $this->storage->retrieve();
		$steps  = $this->structure->retrieve();

		return array(
			'fields' => $fields,
			'steps'  => $steps,
		);
	}

	/**
	 * Used by endpoint to store changes
	 *
	 * @param WP_REST_Request $request Request from the REST API.
	 *
	 * @return array List of feedback per option if saving succeeded.
	 */
	public function set_configuration( WP_REST_Request $request ) {
		$this->populate_configuration();

		return $this->storage->store( $request->get_json_params() );
	}
}

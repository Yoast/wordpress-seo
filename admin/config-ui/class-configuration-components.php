<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Components.
 */
class WPSEO_Configuration_Components {

	/**
	 * List of registered components.
	 *
	 * @var WPSEO_Config_Component[]
	 */
	protected $components = array();

	/**
	 * Adapter.
	 *
	 * @var WPSEO_Configuration_Options_Adapter
	 */
	protected $adapter;

	/**
	 * Add default components.
	 */
	public function initialize() {
		$this->add_component( new WPSEO_Config_Component_Mailchimp_Signup() );
		$this->add_component( new WPSEO_Config_Component_Suggestions() );
	}

	/**
	 * Add a component.
	 *
	 * @param WPSEO_Config_Component $component Component to add.
	 */
	public function add_component( WPSEO_Config_Component $component ) {
		$this->components[] = $component;
	}

	/**
	 * Sets the storage to use.
	 *
	 * @param WPSEO_Configuration_Storage $storage Storage to use.
	 */
	public function set_storage( WPSEO_Configuration_Storage $storage ) {
		$this->set_adapter( $storage->get_adapter() );

		foreach ( $this->components as $component ) {
			$storage->add_field( $component->get_field() );
		}
	}

	/**
	 * Sets the adapter to use.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to use.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$this->adapter = $adapter;

		foreach ( $this->components as $component ) {
			$adapter->add_custom_lookup(
				$component->get_field()->get_identifier(),
				array(
					$component,
					'get_data',
				),
				array(
					$component,
					'set_data',
				)
			);
		}
	}
}

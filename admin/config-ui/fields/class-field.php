<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field {
	protected $field;
	protected $component;
	protected $properties = array();
	protected $data;

	/**
	 * WPSEO_Config_Field constructor.
	 *
	 * @param string $field
	 * @param string $component
	 */
	public function __construct( $field, $component ) {
		$this->field     = $field;
		$this->component = $component;
	}

	public function get_identifier() {
		return $this->field;
	}

	public function get_component() {
		return $this->component;
	}

	public function set_property( $name, $value ) {
		$this->properties[ $name ] = $value;
	}

	public function get_properties() {
		return $this->properties;
	}

	public function get_data() {
		return $this->data;
	}
}

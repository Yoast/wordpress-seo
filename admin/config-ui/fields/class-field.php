<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field
 */
abstract class WPSEO_Config_Field {
	/** @var string Field name */
	protected $field;

	/** @var string Component to use */
	protected $component;

	/** @var array Properties of this field */
	protected $properties = array();

	/** @var array|mixed Value of this field */
	protected $data;

	/**
	 * WPSEO_Config_Field constructor.
	 *
	 * @param string $field     The field name.
	 * @param string $component The component to use.
	 */
	public function __construct( $field, $component ) {
		$this->field     = $field;
		$this->component = $component;
	}

	/**
	 * Get the identifier
	 *
	 * @return string
	 */
	public function get_identifier() {
		return $this->field;
	}

	/**
	 * Get the component
	 *
	 * @return string
	 */
	public function get_component() {
		return $this->component;
	}

	/**
	 * Set a property value
	 *
	 * @param string $name  Property to set.
	 * @param mixed  $value Value to apply.
	 */
	public function set_property( $name, $value ) {
		$this->properties[ $name ] = $value;
	}

	/**
	 * Get all the properties
	 *
	 * @return array
	 */
	public function get_properties() {
		return $this->properties;
	}

	/**
	 * Get the data
	 *
	 * @return mixed
	 */
	public function get_data() {
		return $this->data;
	}
}

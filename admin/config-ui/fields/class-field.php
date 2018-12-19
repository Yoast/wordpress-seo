<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field
 */
class WPSEO_Config_Field {

	/**
	 * Field name.
	 *
	 * @var string
	 */
	protected $field;

	/**
	 * Component to use.
	 *
	 * @var string
	 */
	protected $component;

	/**
	 * Properties of this field.
	 *
	 * @var array
	 */
	protected $properties = array();

	/**
	 * Field requirements.
	 *
	 * @var array
	 */
	protected $requires = array();

	/**
	 * Value of this field.
	 *
	 * @var array|mixed
	 */
	protected $data = array();

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

	/**
	 * Array representation of this object.
	 *
	 * @return array
	 */
	public function to_array() {
		$output = array(
			'componentName' => $this->get_component(),
		);

		$properties = $this->get_properties();
		if ( $properties ) {
			$output['properties'] = $properties;
		}

		$requires = $this->get_requires();
		if ( ! empty( $requires ) ) {
			$output['requires'] = $requires;
		}

		return $output;
	}

	/**
	 * Set the adapter to use
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
	}

	/**
	 * Requires another field to have a certain value.
	 *
	 * @param string $field Field to check for a certain value.
	 * @param mixed  $value Value of the field.
	 */
	public function set_requires( $field, $value ) {
		$this->requires = array(
			'field' => $field,
			'value' => $value,
		);
	}

	/**
	 * Get the required field settings (if present)
	 *
	 * @return array
	 */
	public function get_requires() {
		return $this->requires;
	}
}

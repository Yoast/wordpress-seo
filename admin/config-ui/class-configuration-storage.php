<?php

class WPSEO_Configuration_Storage {

	/** @var WPSEO_Configuration_Options_Adapter */
	private $adapter;

	/** @var array WPSEO_Config_Field */
	private $fields = array();

	/**
	 * WPSEO_Configuration_Storage constructor.
	 *
	 * Construct internal fields
	 */
	public function __construct() {
		$this->add_field( new WPSEO_Config_Field_Upsell_Configuration_Service() );
		$this->add_field( new WPSEO_Config_Field_Upsell_Site_Review() );
		$this->add_field( new WPSEO_Config_Field_Success_Message() );
		$this->add_field( new WPSEO_Config_Field_Mailchimp_Signup() );
		$this->add_field( new WPSEO_Config_Field_Environment() );
		$this->add_field( new WPSEO_Config_Field_Site_Type() );
		$this->add_field( new WPSEO_Config_Field_Tag_Line() );
		$this->add_field( new WPSEO_Config_Field_Multiple_Authors() );
		$this->add_field( new WPSEO_Config_Field_Site_Name() );
		$this->add_field( new WPSEO_Config_Field_Separator() );

		$this->add_field( new WPSEO_Config_Field_Profile_URL_Facebook() );
		$this->add_field( new WPSEO_Config_Field_Profile_URL_Twitter() );
		$this->add_field( new WPSEO_Config_Field_Profile_URL_Instagram() );
		$this->add_field( new WPSEO_Config_Field_Profile_URL_LinkedIn() );
		$this->add_field( new WPSEO_Config_Field_Profile_URL_MySpace() );
		$this->add_field( new WPSEO_Config_Field_Profile_URL_Pinterest() );
		$this->add_field( new WPSEO_Config_Field_Profile_URL_YouTube() );
		$this->add_field( new WPSEO_Config_Field_Profile_URL_GooglePlus() );
	}

	/**
	 * Allow for field injections
	 *
	 * @param WPSEO_Config_Field $field Field to add to the stack
	 */
	public function add_field( WPSEO_Config_Field $field ) {
		$this->fields[] = $field;
	}

	/**
	 * @param WPSEO_Configuration_Options_Adapter $adapter
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$this->adapter = $adapter;
	}

	/**
	 * Retrieve the current adapter
	 *
	 * @return WPSEO_Configuration_Options_Adapter
	 */
	public function get_adapter() {
		return $this->adapter;
	}

	/**
	 * Retrieve the registered fields
	 *
	 * @returns array List of settings.
	 */
	public function retrieve() {
		$output = array();

		/** @var WPSEO_Config_Field $field */
		foreach ( $this->fields as $field ) {
			$build = array(
				'component' => $field->get_component()
			);

			$properties = $field->get_properties();
			if ( $properties ) {
				$build['properties'] = $properties;
			}

			$data = $this->adapter->get( $field );

			if ( is_array( $data ) ) {
				$defaults = $field->get_data();

				// Remove 'null' values from input.
				$data = array_filter( $data, array( $this, 'is_not_null' ) );

				// Merge defaults with data.
				$data = array_merge( $defaults, $data );
			}

			if ( is_null( $data ) ) {
				// Get default if no data was set.
				$data = $field->get_data();
			}

			if ( ! is_null( $data ) ) {
				$build['data'] = $data;
			}

			$output[ $field->get_identifier() ] = $build;
		}

		return $output;
	}

	/**
	 * Save the data
	 *
	 * @param array $data
	 *
	 * @return string Results
	 */
	public function store( $data ) {
		return 'cool';
	}

	/**
	 * Filter out null input values
	 *
	 * @param mixed $input
	 *
	 * @return bool
	 */
	protected function is_not_null( $input ) {
		return ! is_null( $input );
	}

}

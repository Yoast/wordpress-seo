<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Storage.
 */
class WPSEO_Configuration_Storage {

	/**
	 * @var \WPSEO_Configuration_Options_Adapter
	 */
	protected $adapter;

	/**
	 * @var \WPSEO_Config_Field[]
	 */
	protected $fields = array();

	/**
	 * Add default fields.
	 */
	public function add_default_fields() {
		$fields = array(
			new WPSEO_Config_Field_Upsell_Configuration_Service(),
			new WPSEO_Config_Field_Upsell_Site_Review(),
			new WPSEO_Config_Field_Success_Message(),
			new WPSEO_Config_Field_Mailchimp_Signup(),
			new WPSEO_Config_Field_Environment(),
			new WPSEO_Config_Field_Site_Type(),
			new WPSEO_Config_Field_Multiple_Authors(),
			new WPSEO_Config_Field_Title_Intro(),
			new WPSEO_Config_Field_Site_Name(),
			new WPSEO_Config_Field_Separator(),
			new WPSEO_Config_Field_Google_Search_Console_Intro(),
			new WPSEO_Config_Field_Profile_URL_Facebook(),
			new WPSEO_Config_Field_Profile_URL_Twitter(),
			new WPSEO_Config_Field_Profile_URL_Instagram(),
			new WPSEO_Config_Field_Profile_URL_LinkedIn(),
			new WPSEO_Config_Field_Profile_URL_MySpace(),
			new WPSEO_Config_Field_Profile_URL_Pinterest(),
			new WPSEO_Config_Field_Profile_URL_YouTube(),
			new WPSEO_Config_Field_Profile_URL_Wikipedia(),
			new WPSEO_Config_Field_Company_Or_Person(),
			new WPSEO_Config_Field_Company_Name(),
			new WPSEO_Config_Field_Company_Logo(),
			new WPSEO_Config_Field_Person(),
			new WPSEO_Config_Field_Post_Type_Visibility(),
		);

		$post_type_factory = new WPSEO_Config_Factory_Post_Type();
		$fields            = array_merge( $fields, $post_type_factory->get_fields() );

		foreach ( $fields as $field ) {
			$this->add_field( $field );
		}
	}

	/**
	 * Allow for field injections.
	 *
	 * @param WPSEO_Config_Field $field Field to add to the stack.
	 */
	public function add_field( WPSEO_Config_Field $field ) {
		$this->fields[] = $field;

		if ( isset( $this->adapter ) ) {
			$field->set_adapter( $this->adapter );
		}
	}

	/**
	 * Set the adapter to use.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to use.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$this->adapter = $adapter;

		foreach ( $this->fields as $field ) {
			$field->set_adapter( $this->adapter );
		}
	}

	/**
	 * Retrieve the current adapter.
	 *
	 * @return WPSEO_Configuration_Options_Adapter
	 */
	public function get_adapter() {
		return $this->adapter;
	}

	/**
	 * Retrieve the registered fields.
	 *
	 * @returns array List of settings.
	 */
	public function retrieve() {
		$output = array();

		/** @var WPSEO_Config_Field $field */
		foreach ( $this->fields as $field ) {

			$build = $field->to_array();

			$data = $this->get_field_data( $field );
			if ( ! is_null( $data ) ) {
				$build['data'] = $data;
			}

			$output[ $field->get_identifier() ] = $build;
		}

		return $output;
	}

	/**
	 * Save the data.
	 *
	 * @param array $data_to_store Data provided by the API which needs to be processed for saving.
	 *
	 * @return string Results
	 */
	public function store( $data_to_store ) {
		$output = array();

		/** @var WPSEO_Config_Field $field */
		foreach ( $this->fields as $field ) {

			$field_identifier = $field->get_identifier();

			if ( ! array_key_exists( $field_identifier, $data_to_store ) ) {
				continue;
			}

			$field_data = array();
			if ( isset( $data_to_store[ $field_identifier ] ) ) {
				$field_data = $data_to_store[ $field_identifier ];
			}

			$result = $this->adapter->set( $field, $field_data );

			$build = array(
				'result' => $result,
			);

			// Set current data to object to be displayed.
			$data = $this->get_field_data( $field );
			if ( ! is_null( $data ) ) {
				$build['data'] = $data;
			}

			$output[ $field_identifier ] = $build;
		}

		return $output;
	}

	/**
	 * Filter out null input values.
	 *
	 * @param mixed $input Input to test against.
	 *
	 * @return bool
	 */
	protected function is_not_null( $input ) {
		return ! is_null( $input );
	}

	/**
	 * Get data from a specific field.
	 *
	 * @param WPSEO_Config_Field $field Field to get data for.
	 *
	 * @return array|mixed
	 */
	protected function get_field_data( WPSEO_Config_Field $field ) {
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

			return $data;
		}

		return $data;
	}
}

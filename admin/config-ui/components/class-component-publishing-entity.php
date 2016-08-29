<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Component_Publishing_Entity
 */
class WPSEO_Config_Component_Publishing_Entity implements WPSEO_Config_Component {

	/** @var array Mapping option keys to api keys */
	protected $mapping = array(
		'company_or_person' => 'publishingEntityType',
		'person_name'       => 'publishingEntityPersonName',
		'company_name'      => 'publishingEntityCompanyName',
		'company_logo'      => 'publishingEntityCompanyLogo',
	);

	/**
	 * @return string
	 */
	public function get_identifier() {
		return 'PublishingEntity';
	}

	/**
	 * @return WPSEO_Config_Field_Publishing_Entity
	 */
	public function get_field() {
		return new WPSEO_Config_Field_Publishing_Entity();
	}

	/**
	 * Get the current data for this component
	 *
	 * @return array
	 */
	public function get_data() {

		$yoast_option = WPSEO_Options::get_option( 'wpseo' );

		$output = array();
		foreach ( $this->mapping as $option_key => $api_key ) {
			$output[ $api_key ] = $yoast_option[ $option_key ];
		}

		return $output;
	}

	/**
	 * Save changes
	 *
	 * @param array $data Data provided containing the changes.
	 *
	 * @return mixed
	 */
	public function set_data( $data ) {

		$yoast_option = WPSEO_Options::get_option( 'wpseo' );

		$changes = false;
		foreach ( $this->mapping as $option_key => $api_key ) {
			if ( $yoast_option[ $option_key ] !== $data[ $api_key ] ) {
				$yoast_option[ $option_key ] = $data[ $api_key ];

				$changes = true;
			}
		}

		if ( $changes ) {
			// Save changes.
			update_option( 'wpseo', $yoast_option );
			$saved_option = WPSEO_Options::get_option( 'wpseo' );
		}
		else {
			$saved_option = $yoast_option;
		}

		// Array of keys to check if they were saved as provided.
		$saved = array();

		foreach ( $this->mapping as $option_key => $api_key ) {
			$saved[ $api_key ] = ( $saved_option[ $option_key ] === $data[ $api_key ] );
		}

		return $saved;
	}
}

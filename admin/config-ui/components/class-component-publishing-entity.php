<?php

class WPSEO_Config_Component_Publishing_Entity implements WPSEO_Config_Component {

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

	public function get_data() {

		$yoast_option = WPSEO_Options::get_option( 'wpseo' );

		return array(
			"publishingEntityType"        => $yoast_option['company_or_person'],
			"publishingEntityPersonName"  => $yoast_option['person_name'],
			"publishingEntityCompanyName" => $yoast_option['company_name'],
			"publishingEntityCompanyLogo" => $yoast_option['company_logo'],
		);
	}

	/**
	 * @param $data
	 *
	 * @return mixed
	 */
	public function set_data( $data ) {
		// TODO: Implement set_data() method.
	}
}

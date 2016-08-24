<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Publishing_Entity
 */
class WPSEO_Config_Field_Publishing_Entity extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Publishing_Entity constructor.
	 */
	public function __construct() {
		parent::__construct( 'publishingEntity', 'PublishingEntity' );
	}

	/**
	 * @return array
	 */
	public function get_data() {
		$current_user = wp_get_current_user();
		$person_name = ( $current_user->ID > 0 ) ? $current_user->display_name : '';

		return array(
			'publishingEntityType'        => '',
			'publishingEntityPersonName'  => $person_name,
			'publishingEntityCompanyName' => '',
			'publishingEntityCompanyLogo' => '',
		);
	}
}

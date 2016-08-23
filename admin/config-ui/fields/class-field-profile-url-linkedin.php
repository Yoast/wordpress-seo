<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_LinkedIn
 */
class WPSEO_Config_Field_Profile_URL_LinkedIn extends WPSEO_Config_Field {

	public function __construct() {
		parent::__construct( 'profileUrlLinkedIn', 'input' );

		$this->set_property( 'label', 'LinkedIn URL' );
		$this->set_property( 'pattern', '^https:\/\/www\.linkedin\.com\/in\/([^/]+)$' );
	}
}

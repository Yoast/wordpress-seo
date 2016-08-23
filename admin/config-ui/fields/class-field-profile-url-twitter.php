<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_Twitter
 */
class WPSEO_Config_Field_Profile_URL_Twitter extends WPSEO_Config_Field {

	public function __construct() {
		parent::__construct( 'profileUrlTwitter', 'input' );

		$this->set_property( 'label', 'Twitter URL' );
		$this->set_property( 'pattern', '^https:\/\/twitter\.com\/([^/]+)$' );
	}
}

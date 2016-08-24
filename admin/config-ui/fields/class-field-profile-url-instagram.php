<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_Instagram
 */
class WPSEO_Config_Field_Profile_URL_Instagram extends WPSEO_Config_Field {

	public function __construct() {
		parent::__construct( 'profileUrlInstagram', 'input' );

		// @todo apply i18n
		$this->set_property( 'label', 'Instagram URL' );
		$this->set_property( 'pattern', '^https:\/\/www\.instagram\.com\/([^/]+)\/$' );
	}
}

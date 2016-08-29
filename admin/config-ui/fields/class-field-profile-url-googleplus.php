<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_GooglePlus
 */
class WPSEO_Config_Field_Profile_URL_GooglePlus extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Profile_URL_GooglePlus constructor.
	 */
	public function __construct() {
		parent::__construct( 'profileUrlGooglePlus', 'input' );

		// @todo apply i18n
		$this->set_property( 'label', 'Google+ URL' );
		$this->set_property( 'pattern', '^https:\/\/plus\.google\.com\/([^/]+)$' );
	}
}

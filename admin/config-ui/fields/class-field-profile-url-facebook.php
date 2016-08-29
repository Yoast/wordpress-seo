<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_Facebook
 */
class WPSEO_Config_Field_Profile_URL_Facebook extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Profile_URL_Facebook constructor.
	 */
	public function __construct() {
		parent::__construct( 'profileUrlFacebook', 'input' );

		// @todo apply i18n
		$this->set_property( 'label', 'Facebook URL' );
		$this->set_property( 'pattern', '^https:\/\/www\.facebook\.com\/([^/]+)\/$' );
	}
}

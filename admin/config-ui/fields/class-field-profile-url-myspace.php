<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_MySpace
 */
class WPSEO_Config_Field_Profile_URL_MySpace extends WPSEO_Config_Field {

	public function __construct() {
		parent::__construct( 'profileUrlMySpace', 'input' );

		// @todo apply i18n
		$this->set_property( 'label', 'MySpace URL' );
		$this->set_property( 'pattern', '^https:\/\/myspace\.com\/([^/]+)\/$' );
	}
}

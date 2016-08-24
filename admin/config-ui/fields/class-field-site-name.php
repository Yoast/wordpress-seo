<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field_Site_Name extends WPSEO_Config_Field {
	public function __construct() {
		parent::__construct( 'siteName', 'Input' );

		// @todo apply i18n
		$this->set_property( 'label', 'Sitename' );
	}
}
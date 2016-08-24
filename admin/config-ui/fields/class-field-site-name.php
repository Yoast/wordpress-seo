<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Site_Name
 */
class WPSEO_Config_Field_Site_Name extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Site_Name constructor.
	 */
	public function __construct() {
		parent::__construct( 'siteName', 'Input' );

		// @todo apply i18n
		$this->set_property( 'label', 'Sitename' );
	}
}

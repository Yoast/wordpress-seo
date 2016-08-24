<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field_Upsell_Configuration_Service extends WPSEO_Config_Field {

	public function __construct() {
		parent::__construct( "upsellConfigurationService", "HTML" );

		// @todo apply i18n
		$this->set_property( "html", "You can now have Yoast configure Yoast SEO for you." );
	}
}

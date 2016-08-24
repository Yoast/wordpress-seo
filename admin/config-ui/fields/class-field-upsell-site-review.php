<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field_Upsell_Site_Review extends WPSEO_Config_Field {

	public function __construct() {
		parent::__construct( "upsellSiteReview", "HTML" );

		// @todo apply i18n
		$this->set_property( "html", "Get more visitors! Our SEO website review will tell you what to improve!" );
	}
}

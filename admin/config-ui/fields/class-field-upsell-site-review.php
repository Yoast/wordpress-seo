<?php

class WPSEO_Config_Field_Upsell_Site_Review extends WPSEO_Config_Field {

	public function __construct() {
		parent::__construct( "upsellSiteReview", "HTML" );
		$this->set_property( "html", "Get more visitors! Our SEO website review will tell you what to improve!" );
	}
}

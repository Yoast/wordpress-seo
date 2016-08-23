<?php

class WPSEO_Config_Field_Site_Name extends WPSEO_Config_Field {
	public function __construct() {
		parent::__construct( 'siteName', 'Input' );

		$this->set_property( 'label', 'Sitename' );
	}
}
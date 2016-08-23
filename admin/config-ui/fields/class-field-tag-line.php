<?php

class WPSEO_Config_Field_Tag_Line extends WPSEO_Config_Field {
	public function __construct() {
		parent::__construct( 'tagLine', 'Input' );

		$this->set_property( 'label', 'Enter the tag line you want to use for your website. Using the default tag line is not recommended.' );
	}
}

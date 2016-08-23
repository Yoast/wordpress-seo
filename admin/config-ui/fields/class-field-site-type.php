<?php

class WPSEO_Config_Field_Site_Type extends WPSEO_Config_Field_Choice {
	public function __construct() {
		parent::__construct( 'siteType' );

		$this->set_property('label', 'What type of site is {site_url}?' );

		$this->add_choice( 'blog', 'Blog' );
		$this->add_choice( 'shop', 'Webshop' );
		$this->add_choice( 'news', 'News site' );
		$this->add_choice( 'smallBusiness', 'Small business site' );
		$this->add_choice( 'corporateOther', 'Other corporate site' );
		$this->add_choice( 'personalOther', 'Other personal site' );
	}
}

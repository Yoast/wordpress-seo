<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Site_Type
 */
class WPSEO_Config_Field_Site_Type extends WPSEO_Config_Field_Choice {
	public function __construct() {
		parent::__construct( 'siteType' );

		// @todo apply i18n

		$this->set_property('label', sprintf( 'What type of site is %1$s?', get_home_url() ) );

		$this->add_choice( 'blog', 'Blog' );
		$this->add_choice( 'shop', 'Webshop' );
		$this->add_choice( 'news', 'News site' );
		$this->add_choice( 'smallBusiness', 'Small business site' );
		$this->add_choice( 'corporateOther', 'Other corporate site' );
		$this->add_choice( 'personalOther', 'Other personal site' );
	}
}

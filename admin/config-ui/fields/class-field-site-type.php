<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Site_Type
 */
class WPSEO_Config_Field_Site_Type extends WPSEO_Config_Field_Choice {

	/**
	 * WPSEO_Config_Field_Site_Type constructor.
	 */
	public function __construct() {
		parent::__construct( 'siteType' );

		/* translators: %1$s resolves to the home_url of the blog. */
		$this->set_property( 'label', sprintf( __( 'What kind of site is %1$s?', 'wordpress-seo' ), get_home_url() ) );

		$this->add_choice( 'blog', __( 'Blog', 'wordpress-seo' ) );
		$this->add_choice( 'shop', __( 'Webshop', 'wordpress-seo' ) );
		$this->add_choice( 'news', __( 'News site', 'wordpress-seo' ) );
		$this->add_choice( 'smallBusiness', __( 'Small business site', 'wordpress-seo' ) );
		$this->add_choice( 'corporateOther', __( 'Other corporate site', 'wordpress-seo' ) );
		$this->add_choice( 'personalOther', __( 'Other personal site', 'wordpress-seo' ) );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_yoast_lookup( $this->get_identifier(), 'wpseo', 'site_type' );
	}
}

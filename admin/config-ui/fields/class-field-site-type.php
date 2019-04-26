<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Site_Type.
 */
class WPSEO_Config_Field_Site_Type extends WPSEO_Config_Field_Choice {

	/**
	 * WPSEO_Config_Field_Site_Type constructor.
	 */
	public function __construct() {
		parent::__construct( 'siteType' );

		/* translators: %1$s resolves to the home_url of the blog. */
		$this->set_property( 'label', sprintf( __( 'What does the site %1$s represent?', 'wordpress-seo' ), get_home_url() ) );

		$this->add_choice( 'blog', __( 'A blog', 'wordpress-seo' ) );
		$this->add_choice( 'shop', __( 'An online shop', 'wordpress-seo' ) );
		$this->add_choice( 'news', __( 'A news channel', 'wordpress-seo' ) );
		$this->add_choice( 'smallBusiness', __( 'A small offline business', 'wordpress-seo' ) );
		$this->add_choice( 'corporate', __( 'A corporation', 'wordpress-seo' ) );
		$this->add_choice( 'portfolio', __( 'A portfolio', 'wordpress-seo' ) );
		$this->add_choice( 'other', __( 'Something else', 'wordpress-seo' ) );
	}

	/**
	 * Set adapter.
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_option_lookup( $this->get_identifier(), 'site_type' );
	}
}

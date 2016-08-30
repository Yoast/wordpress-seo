<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Upsell_Configuration_Service
 */
class WPSEO_Config_Field_Upsell_Configuration_Service extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Upsell_Configuration_Service constructor.
	 */
	public function __construct() {
		parent::__construct( 'upsellConfigurationService', 'HTML' );

		$this->set_property( 'html', __( 'You can now have Yoast configure Yoast SEO for you.', 'wordpress-seo' ) );
	}
}

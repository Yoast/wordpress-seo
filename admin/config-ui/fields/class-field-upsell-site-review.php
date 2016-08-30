<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Upsell_Site_Review
 */
class WPSEO_Config_Field_Upsell_Site_Review extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Upsell_Site_Review constructor.
	 */
	public function __construct() {
		parent::__construct( 'upsellSiteReview', 'HTML' );

		$this->set_property( 'html', __( 'Get more visitors! Our SEO website review will tell you what to improve!', 'wordpress-seo' ) );
	}
}

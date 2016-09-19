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

		$upsell_text = sprintf(
			__( 'Get more visitors! Our %1$sSEO website review%2$s will tell you what to improve!', 'wordpress-seo' ),
			'<a href="https://yoa.st/1a" target="_blank">',
			'</a>'
		);

		$html = '<p>' . $upsell_text . '</p>';

		$this->set_property( 'html', $html );
	}
}

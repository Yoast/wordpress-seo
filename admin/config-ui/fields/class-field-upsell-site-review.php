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
			/* translators: Text between %1$s and %2$s will be a link to a review explanation page. Text between %3$s and %4$s will be a link to an SEO copywriting course page. */
			__( 'If you want more help creating awesome content, check out our %3$sSEO copywriting course%4$s. Do you want to know all about the features of the plugin, consider doing our %1$Yoast SEO for WordPress training%2$s!', 'wordpress-seo' ),
			'<a href="https://yoa.st/yoastseotraining" target="_blank">',
			'</a>',
			'<a href="https://yoa.st/configuration-wizard-copywrite-course-link" target="_blank">',
			'</a>'
		);

		$html = '<p>' . $upsell_text . '</p>';

		$this->set_property( 'html', $html );
	}
}

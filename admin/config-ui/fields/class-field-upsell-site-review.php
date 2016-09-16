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

		/* translators: Text between %1$s and %2$s will be a link to a review explanation page. Text between %3$s and %4$s will be a link to an SEO copywriting course page. */
		$upsell_text = sprintf(
			__( 'If you want more help creating awesome content, check out our %3$sSEO copywriting course%4$s. We can also %1$sreview your site%2$s if you’d like some more in-depth help!', 'wordpress-seo' ),
			'<a href="https://yoa.st/1a" target="_blank">',
			'</a>',
			'<a href="https://yoa.st/configuration-wizard-copywrite-course-link" target="_blank">',
			'</a>'
		);

		$html = '<p>' . $upsell_text . '</p>';

		$this->set_property( 'html', $html );
	}
}

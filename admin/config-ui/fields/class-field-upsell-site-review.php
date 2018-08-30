<?php
/**
 * WPSEO plugin file.
 *
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
			/* translators: %1$s will be a link to a review explanation page. Text between %2$s and %3$s will be a link to an SEO copywriting course page. */
			__( 'If you want more help creating awesome content, check out our %2$sSEO copywriting course%3$s. Do you want to know all about the features of the plugin, consider doing our %1$s!', 'wordpress-seo' ),
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/yoastseotraining' ) . '" target="_blank">Yoast SEO for WordPress training</a>',
			'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/configuration-wizard-copywrite-course-link' ) . '" target="_blank">',
			'</a>'
		);

		$html = '<p>' .
				wp_kses( $upsell_text, array(
					'a' => array(
						'href'   => array(),
						'target' => array( '_blank' ),
					),
				) ) .
				'</p>';

		$this->set_property( 'html', $html );
	}
}

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

		$intro_text = __( 'Welcome to the Yoast SEO installation wizard. In a few simple steps we\'ll help you configure your SEO settings to match your website\'s needs!', 'wordpress-seo' );

		$upsell_text = __( 'As a service to our Premium customers, we offer the Yoast SEO configuration service. Setting up Yoast SEO Premium can be a daunting task if you’re not into the ins and outs of SEO. Although we try to make it as simple as possible, we do realize that it might not be “for you”. For this reason we offer the Yoast SEO configuration service. We’ll set up Yoast SEO Premium for you and make sure it has the correct settings for your site!', 'wordpress-seo' );

		/* Translators: %1$s opens the link, %2$s closes the link. */
		$call_to_action = sprintf(
			__( 'Order %1$sYoast SEO Premium with our configuration service%2$s here!', 'wordpress-seo' ),
			"<a href='https://yoa.st/configuration-package'>",
			"</a>"
		);

		$html = "";

		$html .= "<p>" . $intro_text . "</p>";
		$html .= "<p><em>" . $upsell_text . "</em></p>";
		$html .= "<p><em>" . $call_to_action . "</em></p>";


		$this->set_property( 'html', $html );
	}
}

<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Social_Profiles_Intro
 */
class WPSEO_Config_Field_Social_Profiles_Intro extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Social_Profiles_Intro constructor.
	 */
	public function __construct() {
		parent::__construct( 'socialProfilesIntro', 'HTML' );

		/* translators: %s is the plugin name */
		$intro_text = sprintf( __( '%1$s can tell search engines about your social media profiles. ' .
						  'These will be used in Google\'s Knowledge Graph. There are additional ' .
						  'sharing options in the advanced settings.', 'wordpress-seo' ), 'Yoast SEO' );

		$link = '<a>' . __( 'More info', 'wordpress-seo' ) . '</a>';

		$html = '<p>' . esc_html( $intro_text ) . ' ' . $link . '</p>';

		$this->set_property( 'html', $html );
	}
}

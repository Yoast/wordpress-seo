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

		$intro_text = __( 'Please add all your relevant social profiles. We use these to let search engines know about them, and to enhance your social metadata:', 'wordpress-seo' );

		$html = '<p>' . esc_html( $intro_text ) . '</p>';

		$this->set_property( 'html', $html );
	}
}

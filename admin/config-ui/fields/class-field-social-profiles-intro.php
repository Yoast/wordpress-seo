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

		$intro_text = __( 'To let search engines know which social profiles are associated to this site, enter them below:', 'wordpress-seo' );

		$html = '<p>' . $intro_text . '</p>';

		$this->set_property( 'html', $html );
	}
}

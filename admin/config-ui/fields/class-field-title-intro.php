<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Title_Intro.
 */
class WPSEO_Config_Field_Title_Intro extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Social_Profiles_Intro constructor.
	 */
	public function __construct() {
		parent::__construct( 'titleIntro', 'HTML' );

		$html = __( 'On this page, you can change the name of your site and choose which separator to use. The separator will display, for instance, between your post title and site name. Symbols are shown in the size they\'ll appear in the search results. Choose the one that fits your brand best or takes up the least space in the snippets.', 'wordpress-seo' );

		$html = '<p>' . esc_html( $html ) . '</p>';

		$this->set_property( 'html', $html );
	}
}

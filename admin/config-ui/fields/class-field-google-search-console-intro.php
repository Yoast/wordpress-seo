<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Social_Profiles_Intro
 */
class WPSEO_Config_Field_Google_Search_Console_Intro extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Social_Profiles_Intro constructor.
	 */
	public function __construct() {
		parent::__construct( 'googleSearchConsoleIntro', 'HTML' );

		/* translators: %1$s is the plugin name */
		$html = sprintf(
			__( '%1$s integrates with Google Search Console. Search Console is a
 must-have tool for site owners. You can use it to get a lot of data about
 the health of your site. This data can be accessed from within %1$s
 if you grant ia access. Don\'t have a Search Console account or is your
 site not activated yet? Find out %2$show to connect Search Console to your site.%3$s',
				'wordpress-seo' ),
			'Yoast SEO',
			'<a href="https://yoa.st/1ex">',
			'</a>' );

		$disclaimer = __( 'Ps: we don\'t store your data in any way and don\'t have full access to your account. 
Your privacy is safe with us.', 'wordpress-seo' );

		$html = '<p>' . $html . '</p><small>' . esc_html( $disclaimer ) . '</small>';

		$this->set_property( 'html', $html );
	}
}

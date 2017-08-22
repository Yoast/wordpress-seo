<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Connect_Google_Search_Console
 */
class WPSEO_Config_Field_Connect_Google_Search_Console extends WPSEO_Config_Field {
	/**
	 * WPSEO_Config_Field_Connect_Google_Search_Console constructor.
	 */
	public function __construct() {
		parent::__construct( 'connectGoogleSearchConsole', 'ConnectGoogleSearchConsole' );

		/* translators: %s is the plugin name */
		$intro1 = sprintf( __( '%1$s integrates with Google Search Console. Search Console is a '.
							  'must-have tool for site owners. You can use it to get a lot of data about ' .
							  'the health of your site. This data can be accessed from within %1$s ' .
							  'if you grant ia access. Don\'t have a Search Console account or is your ' .
							  'site not activated yet?', 'wordpress-seo' ), 'Yoast SEO' );

		$link = '<a>' . esc_html( __( 'Find out how to connect Search Console to your site.') ) . '</a>';

		$disclaimer = __( 'Ps: we don\'t store your data in any way and don\'t have full access to your account. ' .
						  'Your privacy is safe with us.' );

		$html = '<p>' . esc_html( $intro1 ) . ' ' . $link . '</p>' . '<small>' . esc_html( $disclaimer ) . '</small>';

		$this->set_property( 'html', $html );
	}

	/**
	 * Get the data
	 *
	 * @return array
	 */
	public function get_data() {
		return array(
			'profile'     => '',
			'profileList' => '',
		);
	}
}

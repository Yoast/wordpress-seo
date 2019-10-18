<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Google_Search_Console_Intro.
 *
 * @deprecated 12.5
 *
 * @codeCoverageIgnore
 */
class WPSEO_Config_Field_Google_Search_Console_Intro extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Social_Profiles_Intro constructor.
	 *
	 * @deprecated 12.5
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 12.5' );

		parent::__construct( 'googleSearchConsoleIntro', 'HTML' );

		$html =
			sprintf(
				/* translators: %1$s is the plugin name. %2$s is a link start tag to a Yoast help page, %3$s is the link closing tag. */
				esc_html__( '%1$s integrates with Google Search Console, a must-have tool for site owners. It provides you with information about the health of your site. Don\'t have a Google account or is your site not activated yet? Find out %2$show to connect Google Search Console to your site%3$s.', 'wordpress-seo' ),
				'Yoast SEO',
				'<a href="' . esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/1ex' ) ) . '" target="_blank">',
				'</a>'
			);

		$disclaimer = __( 'Note: we don\'t store your data in any way and don\'t have full access to your account. Your privacy is safe with us.', 'wordpress-seo' );

		$html = '<p>' . $html . '</p><small>' . esc_html( $disclaimer ) . '</small>';

		$this->set_property( 'html', $html );
	}
}

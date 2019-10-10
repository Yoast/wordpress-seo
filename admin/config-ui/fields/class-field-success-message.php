<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Success_Message.
 */
class WPSEO_Config_Field_Success_Message extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Success_Message constructor.
	 */
	public function __construct() {
		parent::__construct( 'successMessage', 'FinalStep' );

		$success_message = sprintf(
			/* translators: %1$s expands to Yoast SEO. */
			__( '%1$s will now take care of all the needed technical optimization of your site. To really improve your site\'s performance in the search results, it\'s important to know everything our plugin has to offer. Sign up for our free %1$s plugin training, in which you\'ll learn how to use %1$s and how it can help you make the best of your website!', 'wordpress-seo' ),
			'Yoast SEO'
		);

		$this->set_property( 'title', __( 'You\'ve done it!', 'wordpress-seo' ) );
		$this->set_property( 'message', $success_message );
		$this->set_property( 'href', WPSEO_Shortlinker::get( 'https://yoa.st/3rp' ) );

		/* translators: %1$s expands to Yoast SEO. */
		$img_alt  = __( '%1$s video tutorial', 'wordpress-seo' );
		$img_args = array(
			'src' => plugin_dir_url( WPSEO_FILE ) . ( 'images/Yoast_Academy_video.png' ),
			'alt' => sprintf( $img_alt, 'Yoast SEO' ),
		);

		$this->set_property( 'image', $img_args );
	}
}

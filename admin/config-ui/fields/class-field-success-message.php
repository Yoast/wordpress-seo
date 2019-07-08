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
			__( '%1$s will now take care of all the needed technical optimization of your site. To really improve your site\'s performance in the search results, it\'s important to start creating content that ranks well for keyphrases you care about. Check out this video in which we explain how to use the %1$s metabox when you edit posts or pages.', 'wordpress-seo' ),
			'Yoast SEO'
		);

		$this->set_property( 'title', __( 'You\'ve done it!', 'wordpress-seo' ) );
		$this->set_property( 'message', $success_message );

		/* translators: %1$s expands to Yoast SEO. */
		$video_title = __( '%1$s video tutorial', 'wordpress-seo' );
		$video_args  = array(
			'url'   => WPSEO_Shortlinker::get( 'https://yoa.st/metabox-screencast' ),
			'title' => sprintf( $video_title, 'Yoast SEO' ),
		);
		$this->set_property( 'video', $video_args );
	}
}

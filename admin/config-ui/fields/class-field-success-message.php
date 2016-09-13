<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Success_Message
 */
class WPSEO_Config_Field_Success_Message extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Success_Message constructor.
	 */
	public function __construct() {
		parent::__construct( 'successMessage', 'HTML' );

		// @todo: replace {gif_showing_content_analysis}
		$this->set_property( 'html', __( "Good Job! You've finished setting up Yoast SEO. Thereby you've covered the technical part of your site's SEO. Now it's time to focus on optimizing your content for onpage SEO. You can use our content analysis for that: <br>{gif_showing_content_analysis}", 'wordpress-seo' ) );
	}
}

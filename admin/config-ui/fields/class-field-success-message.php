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

		$success_message = __( 'You’ve done it! You&#039;ve set up Yoast SEO, and Yoast SEO will now take care of all the needed technical optimization of your site. To really improve your site&#039;s performance in the search results, it&#039;s important to start creating content that ranks well for keywords you care about.', 'wordpress-seo' );
		$onpage_seo = __( 'Check out the video below in which we explain how to use the Yoast SEO metabox when you edit posts or pages', 'wordpress-seo' );
		$content_analysis_video = sprintf(
			'<iframe width="560" height="315" src="https://yoa.st/metabox-screencast" title="%s" frameborder="0" allowfullscreen></iframe>',
			__( 'Yoast SEO video tutorial', 'wordpress-seo' )
		);

		$html = '<p>' . $success_message . '</p>';
		$html .= '<p>' . $onpage_seo . '</p>';
		$html .= '<div class="yoast-video-container-max-width"><div class="yoast-video-container">' . $content_analysis_video . '</div></div>';

		$this->set_property( 'html', $html );
	}
}

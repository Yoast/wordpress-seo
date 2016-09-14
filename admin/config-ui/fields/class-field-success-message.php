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

		$success_message = __( "You've finished setting up Yoast SEO. Thereby you've covered the technical part of your site's SEO.", 'wordpress-seo' );
		$onpage_seo = __( "Now it's time to start optimizing your content! Check out the getting started video below in which Joost explains how to do this!", 'wordpress-seo' );
		$content_analysis_video = '<iframe width="560" height="315" src="https://yoa.st/metabox-screencast" frameborder="0" allowfullscreen></iframe>';

		$html = '<p>' . $success_message . '</p>';
		$html .= '<p>' . $onpage_seo . '</p>';
		$html .= '<p>' . $content_analysis_video . '</p>';

		$this->set_property( 'html', $html );
	}
}

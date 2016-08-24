<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field_Success_Message extends WPSEO_Config_Field {

	public function __construct() {
		parent::__construct( "successMessage", "HTML" );

		// @todo apply i18n
		$this->set_property( "html", "Good Job! You've finished setting up Yoast SEO. Thereby you've covered the technical part of your site's SEO. Now it's time to focus on optimizing your content for onpage SEO. You can use our content analysis for that: <br>{gif_showing_content_analysis}" );
	}
}

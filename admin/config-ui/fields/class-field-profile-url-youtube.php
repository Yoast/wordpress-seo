<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_YouTube
 */
class WPSEO_Config_Field_Profile_URL_YouTube extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Profile_URL_YouTube constructor.
	 */
	public function __construct() {
		parent::__construct( 'profileUrlYouTube', 'input' );

		// @todo apply i18n
		$this->set_property( 'label', 'YouTube URL' );
		$this->set_property( 'pattern', '^https:\/\/www\.youtube\.com\/([^/]+)$' );
	}
}

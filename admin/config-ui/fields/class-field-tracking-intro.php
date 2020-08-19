<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Tracking_Intro.
 */
class WPSEO_Config_Field_Tracking_Intro extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Tracking_Intro constructor.
	 */
	public function __construct() {
		parent::__construct( 'trackingIntro', 'HTML' );

		$html = '<p>' . esc_html__( 'At Yoast, we are always keen on providing the very best experience for you. To do so, we\'d like to collect some data about which other plugins and themes you have installed, and which features you use and don\'t use. Be assured that we\'ll never resell that data. And of course, as always, we won\'t collect any personal data about you or your visitors!', 'wordpress-seo' ) . '</p>';

		$html .= '<p><a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/usage-tracking' ) . '" target="_blank">' . esc_html__( 'Read more about our usage tracking.', 'wordpress-seo' ) . '</a></p>';

		$this->set_property( 'html', $html );
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Inc
 */

/**
 * Makes sure no output will be given during my yoast plugin install.
 */
class WPSEO_MyYoast_Plugin_Installer_Skin extends WP_Upgrader_Skin {

	/**
	 * Overrides the header method by doing nothing.
	 */
	public function header() {

	}

	/**
	 * Overrides the footer method by doing nothing.
	 */
	public function footer() {

	}

	/**
	 * Overrides the feedback method by doing nothing.
	 *
	 * @param string $string The value to give back as feedback.
	 */
	public function feedback( $string ) {

	}
}

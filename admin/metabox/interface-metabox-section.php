<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Generates and displays the HTML for a metabox section.
 */
interface WPSEO_Metabox_Section {

	/**
	 * Outputs the section link.
	 */
	public function display_link();

	/**
	 * Outputs the section content.
	 */
	public function display_content();
}

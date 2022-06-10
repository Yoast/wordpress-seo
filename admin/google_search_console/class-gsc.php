<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\admin\google_search_console
 */

/**
 * Class WPSEO_GSC.
 */
class WPSEO_GSC {

	/**
	 * Outputs the HTML for the redirect page.
	 *
	 * @return void
	 */
	public function display() {
		require_once WPSEO_PATH . 'admin/google_search_console/views/gsc-display.php';
	}
}

<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Ryte_Double extends WPSEO_Ryte {

	/**
	 * Overwrite the request_indexibility method, because it uses a dependency.
	 *
	 * @return int
	 */
	protected function request_indexability() {
		if ( home_url() === 'http://example.org' ) {
			return 1;
		}

		return 0;
	}

	/**
	 * Overwrite the method because it has a dependency.
	 *
	 * @return void
	 */
	protected function notify_admins() {

	}

	/**
	 * Should the notice being given?
	 *
	 * @return bool True if a notice should be shown.
	 */
	public function should_show_notice() {
		return parent::should_show_notice();
	}
}

<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_OnPage_Double extends WPSEO_OnPage {

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
	 * Overwrite the method because is has a dependency.
	 *
	 * @return void
	 */
	protected function notify_admins() {

	}

	/**
	 * @inheritdoc
	 */
	public function should_show_notice() {
		return parent::should_show_notice();
	}
}

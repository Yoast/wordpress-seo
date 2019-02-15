<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_MyYoast_Route_Double extends WPSEO_MyYoast_Route {

	/**
	 * @inheritdoc
	 */
	public function get_action() {
		return parent::get_action();
	}
}

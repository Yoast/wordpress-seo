<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Features_Mock extends WPSEO_Features {

	/**
	 * Checks if using the free version of the plugin.
	 *
	 * @return bool
	 */
	public function is_free() {
		return false;
	}
}

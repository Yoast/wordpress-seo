<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Extension_Manager_Double extends WPSEO_Extension_Manager {

	/**
	 * Helper function that sets the active extensions.
	 *
	 * @param mixed $extensions The active extensions.
	 */
	public function set_active_extensions( $extensions ) {
		self::$active_extensions = $extensions;
	}
}

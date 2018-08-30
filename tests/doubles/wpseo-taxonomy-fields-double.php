<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Taxonomy_Fields_Double extends WPSEO_Taxonomy_Fields {

	/**
	 * This method should return the fields.
	 *
	 * @return array
	 */
	public function get() {
		return array( '1', '2', '3' );
	}
}

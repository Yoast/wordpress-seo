<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Taxonomy
 */

/**
 * Unit Test Class.
 */
class WPSEO_Taxonomy_Fields_Test extends WPSEO_UnitTestCase {

	public function test_construct() {
		$class = new WPSEO_Taxonomy_Fields_Double( (object) array( 'term' ) );

		$this->assertEquals(
			array( '1', '2', '3' ),
			$class->get()
		);
	}
}

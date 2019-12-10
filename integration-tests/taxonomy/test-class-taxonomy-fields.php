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

	/**
	 * Tests if the abstract get method is implemented the right way.
	 *
	 * @covers WPSEO_Taxonomy_Fields::get
	 */
	public function test_construct() {
		$class = new WPSEO_Taxonomy_Fields_Double( (object) [ 'term' ] );

		$this->assertEquals(
			[ '1', '2', '3' ],
			$class->get()
		);
	}
}

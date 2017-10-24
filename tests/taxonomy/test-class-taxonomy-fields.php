<?php
/**
 * @package WPSEO\Tests\Taxonomy
 */

/**
 * Test Helper Class.
 */
class WPSEO_Taxonomy_Fields_Double extends WPSEO_Taxonomy_Fields {

	/**
	 * This method should return the fields
	 *
	 * @return array
	 */
	public function get() {
		return $this->options;
	}

}

/**
 * Unit Test Class.
 */
class WPSEO_Taxonomy_Fields_Test extends WPSEO_UnitTestCase {

	public function test_construct_with_options() {
		$class = new WPSEO_Taxonomy_Fields_Double( (object) array( 'term' ), array( 'has' => 'options' ) );

		$this->assertEquals(
			array( 'has' => 'options' ),
			$class->get()
		);
	}

}

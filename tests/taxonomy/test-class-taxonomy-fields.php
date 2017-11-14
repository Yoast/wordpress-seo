<?php
/**
 * @package WPSEO\Tests\Taxonomy
 */

/**
 * Unit Test Class.
 */
class WPSEO_Taxonomy_Fields_Test extends WPSEO_UnitTestCase {

	/**
	 * Include helper class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		require_once WPSEO_TESTS_PATH . 'doubles/wpseo-taxonomy-fields-double.php';
	}

	public function test_construct_with_options() {
		$class = new WPSEO_Taxonomy_Fields_Double( (object) array( 'term' ), array( 'has' => 'options' ) );

		$this->assertEquals(
			array( 'has' => 'options' ),
			$class->get()
		);
	}

}

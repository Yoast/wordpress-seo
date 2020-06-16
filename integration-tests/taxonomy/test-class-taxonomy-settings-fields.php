<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Taxonomy
 */

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Taxonomy_Settings_Fields
 */
class WPSEO_Taxonomy_Settings_Fields_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Taxonomy_Settings_Fields_Double
	 */
	private $class_instance;

	/**
	 * The created term.
	 *
	 * @var stdClass
	 */
	private $term;

	/**
	 * Adding a term and set the class instance.
	 */
	public function setUp() {
		parent::setUp();

		$this->term           = $this->factory->term->create_and_get();
		$this->class_instance = new WPSEO_Taxonomy_Settings_Fields_Double( $this->term );
	}

	/**
	 * Test if the array is set properly by picking the first and the last value.
	 *
	 * @covers ::get
	 */
	public function test_get_fields() {

		$fields = $this->class_instance->get();

		$this->assertTrue( is_array( $fields ) );

		$this->assertTrue( array_key_exists( 'noindex', $fields ) );
		$this->assertEquals( 'hidden', $fields['noindex']['type'] );
	}

	/**
	 * Test if the breadcrumbs title field will be hidden if the option 'breadcrumbs-enable' is set to false.
	 *
	 * @covers ::get
	 */
	public function test_get_fields_hidden_breadcrumb() {
		$this->class_instance->set_option( 'breadcrumbs-enable', true );
		$this->assertTrue( array_key_exists( 'bctitle', $this->class_instance->get() ) );

		$this->class_instance->set_option( 'breadcrumbs-enable', false );
		$this->assertFalse( array_key_exists( 'bctitle', $this->class_instance->get() ) );
	}
}

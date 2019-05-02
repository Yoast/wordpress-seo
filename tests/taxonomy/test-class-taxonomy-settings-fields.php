<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Taxonomy
 */

/**
 * Unit Test Class.
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
	 * WPSEO_Taxonomy_Settings_Fields::get
	 */
	public function test_get_fields() {

		$fields = $this->class_instance->get();

		$this->assertTrue( is_array( $fields ) );

		$this->assertTrue( array_key_exists( 'noindex', $fields ) );
		$this->assertEquals( 'select', $fields['noindex']['type'] );
	}

	/**
	 * Test if the breadcrumbs title field will be hidden if the option 'breadcrumbs-enable' is set to false.
	 *
	 * WPSEO_Taxonomy_Settings_Fields::get
	 */
	public function test_get_fields_hidden_breadcrumb() {
		$this->class_instance->set_option( 'breadcrumbs-enable', true );
		$this->assertTrue( array_key_exists( 'bctitle', $this->class_instance->get() ) );

		$this->class_instance->set_option( 'breadcrumbs-enable', false );
		$this->assertFalse( array_key_exists( 'bctitle', $this->class_instance->get() ) );
	}

	/**
	 * Test the result of get_robot_index.
	 *
	 * WPSEO_Taxonomy_Content_Fields::get_robot_index
	 */
	public function test_get_robot_index() {
		// Setting no index for current taxonomy to true.
		$this->class_instance->set_option( 'noindex-tax-' . $this->term->taxonomy, true );

		$fields_before = $this->class_instance->get();

		$this->assertEquals(
			'No (current default for Tags)',
			$fields_before['noindex']['options']['options']['default']
		);

		// Setting the noindex to false.
		$this->class_instance->set_option( 'noindex-tax-' . $this->term->taxonomy, false );

		$fields_after = $this->class_instance->get();
		$this->assertEquals(
			'Yes (current default for Tags)',
			$fields_after['noindex']['options']['options']['default']
		);
	}
}

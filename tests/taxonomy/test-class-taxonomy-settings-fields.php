<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Taxonomy_Settings_Fields_Double extends WPSEO_Taxonomy_Settings_Fields {

	/**
	 * Override an option value
	 *
	 * @param string $option_name  The target key which will be overwritten
	 * @param string $option_value The new value for the option.
	 */
	public function set_option($option_name, $option_value) {
		$this->options[ $option_name ] = $option_value;

	}

}

class WPSEO_Taxonomy_Settings_Fields_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Taxonomy_Settings_Fields_Double
	 */
	private  $class_instance;

	/**
	 * @var stdClass The created term.
	 */
	private $term;

	/**
	 * Adding a term and set the class instance
	 */
	public function setUp() {
		parent::setUp();

		$this->term           = $this->factory->term->create_and_get();
		$this->class_instance = new WPSEO_Taxonomy_Settings_Fields_Double( $this->term );
	}

	/**
	 * Test if the array is set properly by picking the first and the last value
	 *
	 * WPSEO_Taxonomy_Settings_Fields::get
	 */
	public function test_get_fields() {

		$fields = $this->class_instance->get();

		$this->assertTrue( is_array( $fields ) );

		$this->assertTrue( array_key_exists( 'sitemap_include', $fields ) );
		$this->assertEquals( 'select', $fields['sitemap_include']['type'] );
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
	 * Test if the breadcrumbs title field will be hidden if the option 'breadcrumbs-enable' is set to false.
	 *
	 * WPSEO_Taxonomy_Settings_Fields::get
	 */
	public function test_get_fields_hidden_meta_keywords() {
		$this->class_instance->set_option( 'usemetakeywords', true );
		$this->assertTrue( array_key_exists( 'metakey', $this->class_instance->get() ) );

		$this->class_instance->set_option( 'usemetakeywords', false );
		$this->assertFalse( array_key_exists( 'metakey', $this->class_instance->get() ) );
	}

	/**
	 * Test the result of get_robot_index
	 *
	 * WPSEO_Taxonomy_Content_Fields::get_robot_index
	 */
	public function test_get_robot_index() {
		// Setting no index for current taxonomy to true.
		$this->class_instance->set_option( 'noindex-tax-' . $this->term->taxonomy, true );

		$fields_before = $this->class_instance->get();

		$this->assertEquals(
			'Default for this taxonomy type, currently: noindex',
			$fields_before['noindex']['options']['options']['default']
		);

		// Setting the noindex to false.
		$this->class_instance->set_option( 'noindex-tax-' . $this->term->taxonomy, false );

		$fields_after = $this->class_instance->get();
		$this->assertEquals(
			'Default for this taxonomy type, currently: index',
			$fields_after['noindex']['options']['options']['default']
		);
	}
}

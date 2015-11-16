<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Taxonomy_Content_Fields_Double extends WPSEO_Taxonomy_Content_Fields {

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

class WPSEO_Taxonomy_Content_Fields_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Taxonomy_Social_Fields_Double
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
		$this->class_instance = new WPSEO_Taxonomy_Content_Fields_Double( $this->term );
	}

	/**
	 * Test if the array is set properly by picking the first and the last value
	 *
	 * WPSEO_Taxonomy_Content_Fields::get
	 */
	public function test_get_fields() {

		$fields = $this->class_instance->get();

		$this->assertTrue( is_array( $fields ) );

		$this->assertTrue( array_key_exists( 'title', $fields ) );
		$this->assertEquals( __( 'Snippet Editor', 'wordpress-seo' ), $fields['snippet']['label'] );
	}
}

<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_Taxonomy_Social_Tab_Double extends WPSEO_Taxonomy_Social_Tab {

	/**
	 * Override an option value
	 *
	 * @param string $option_name  The target key which will be overwritten
	 * @param string $option_value The new value for the option.
	 */
	public function set_option($option_name, $option_value) {
		$this->options[$option_name] = $option_value;
	}

}

class WPSEO_Taxonomy_Social_Tab_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Taxonomy_Social_Tab_Double
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
		$this->class_instance = new WPSEO_Taxonomy_Social_Tab_Double( $this->term );

		// Setting the social networks to true
		$this->class_instance->set_option( 'opengraph', true );
		$this->class_instance->set_option( 'twitter', true );
		$this->class_instance->set_option( 'googleplus', true );
	}

	/**
	 * Test with on of the social networks being set.
	 *
	 * @covers WPSEO_Taxonomy_Social_Tab::show_social
	 */
	public function test_show_social() {
		$this->assertTrue( $this->class_instance->show_social() );
	}

	/**
	 * Test with the social networks not being set.
	 *
	 * @covers WPSEO_Taxonomy_Social_Tab::show_social
	 */
	public function test_show_social_hidden() {
		$this->class_instance->set_option( 'opengraph', false );
		$this->class_instance->set_option( 'twitter', false );
		$this->class_instance->set_option( 'googleplus', false );

		$this->assertFalse( $this->class_instance->show_social() );
	}

	/**
	 * Fetching the fields for the social tab with all networks enabled
	 *
	 * @covers WPSEO_Taxonomy_Social_Tab::get_fields
	 */
	public function test_get_fields() {
		$fields = $this->class_instance->get_fields();

		$this->assertTrue( is_array( $fields ) );

		// Fields for OpenGraph.
		$this->assertTrue( array_key_exists( 'opengraph-title', $fields ) );
		$this->assertTrue( array_key_exists( 'opengraph-description', $fields ) );
		$this->assertTrue( array_key_exists( 'opengraph-image', $fields ) );

		// Twitter fields.
		$this->assertTrue( array_key_exists( 'twitter-title', $fields ) );
		$this->assertTrue( array_key_exists( 'twitter-description', $fields ) );
		$this->assertTrue( array_key_exists( 'twitter-image', $fields ) );

		// Fields for Google Plus.
		$this->assertTrue( array_key_exists( 'google-plus-title', $fields ) );
		$this->assertTrue( array_key_exists( 'google-plus-description', $fields ) );
		$this->assertTrue( array_key_exists( 'google-plus-image', $fields ) );
	}

	/**
	 * Fetching the fields for the social tab with OpenGraph disabled
	 *
	 * @covers WPSEO_Taxonomy_Social_Tab::get_fields
	 */
	public function test_get_fields_without_open_graph() {
		// Set opengraph option to false.
		$this->class_instance->set_option( 'opengraph', false );

		$fields = $this->class_instance->get_fields();

		// Fields for OpenGraph.
		$this->assertFalse( array_key_exists( 'opengraph-title', $fields ) );
		$this->assertFalse( array_key_exists( 'opengraph-description', $fields ) );
		$this->assertFalse( array_key_exists( 'opengraph-image', $fields ) );

		// Fields for twitter and google-plus should be there.
		$this->assertTrue( array_key_exists( 'twitter-title', $fields ) );
		$this->assertTrue( array_key_exists( 'google-plus-title', $fields ) );
	}

	/**
	 * Fetching the fields for the social tab with twitter disabled
	 *
	 * @covers WPSEO_Taxonomy_Social_Tab::get_fields
	 */
	public function test_get_fields_without_twitter() {
		// Set opengraph option to false.
		$this->class_instance->set_option( 'twitter', false );

		$fields = $this->class_instance->get_fields();

		// Fields for OpenGraph.
		$this->assertFalse( array_key_exists( 'twitter-title', $fields ) );
		$this->assertFalse( array_key_exists( 'twitter-description', $fields ) );
		$this->assertFalse( array_key_exists( 'twitter-image', $fields ) );

		// Fields for opengraph and google-plus should be there.
		$this->assertTrue( array_key_exists( 'opengraph-title', $fields ) );
		$this->assertTrue( array_key_exists( 'google-plus-title', $fields ) );
	}

	/**
	 * Test with on of the social networks being set.
	 *
	 * @covers WPSEO_Taxonomy_Social_Tab::get_fields
	 */
	public function test_get_fields_without_google_plus() {
		// Set opengraph option to false.
		$this->class_instance->set_option( 'googleplus', false );

		$fields = $this->class_instance->get_fields();

		// Fields for OpenGraph.
		$this->assertFalse( array_key_exists( 'google-plus-title', $fields ) );
		$this->assertFalse( array_key_exists( 'google-plus-description', $fields ) );
		$this->assertFalse( array_key_exists( 'google-plus-image', $fields ) );

		// Fields for opengraph and twitter should be there.
		$this->assertTrue( array_key_exists( 'opengraph-title', $fields ) );
		$this->assertTrue( array_key_exists( 'twitter-title', $fields ) );
	}

}

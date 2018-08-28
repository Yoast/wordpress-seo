<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Taxonomy
 */

/**
 * Unit Test Class.
 */
class WPSEO_Taxonomy_Social_Fields_Test extends WPSEO_UnitTestCase {

	/**
	 * @var stdClass The created term.
	 */
	private $term;

	/**
	 * Adding a term and set the class instance.
	 */
	public function setUp() {
		parent::setUp();

		$this->term = $this->factory->term->create_and_get();

		// Setting the social networks to true.
		WPSEO_Options::set( 'twitter', true );
		WPSEO_Options::set( 'opengraph', true );
	}

	public function get_class_instance() {
		return new WPSEO_Taxonomy_Social_Fields( $this->term );
	}

	/**
	 * Test with on of the social networks being set.
	 *
	 * @covers WPSEO_Taxonomy_Social_Fields::show_social
	 */
	public function test_show_social() {
		$this->assertTrue( $this->get_class_instance()->show_social() );
	}

	/**
	 * Test with the social networks not being set.
	 *
	 * @covers WPSEO_Taxonomy_Social_Fields::show_social
	 */
	public function test_show_social_hidden() {
		WPSEO_Options::set( 'opengraph', false );
		WPSEO_Options::set( 'twitter', false );

		$this->assertFalse( $this->get_class_instance()->show_social() );
	}

	/**
	 * Fetching the fields for the social tab with all networks enabled.
	 *
	 * @covers WPSEO_Taxonomy_Social_Fields::get
	 */
	public function test_get_fields() {
		$fields = $this->get_class_instance()->get();

		$this->assertTrue( is_array( $fields ) );

		// Fields for OpenGraph.
		$this->assertTrue( array_key_exists( 'opengraph-title', $fields ) );
		$this->assertTrue( array_key_exists( 'opengraph-description', $fields ) );
		$this->assertTrue( array_key_exists( 'opengraph-image', $fields ) );

		// Twitter fields.
		$this->assertTrue( array_key_exists( 'twitter-title', $fields ) );
		$this->assertTrue( array_key_exists( 'twitter-description', $fields ) );
		$this->assertTrue( array_key_exists( 'twitter-image', $fields ) );
	}

	/**
	 * Fetching the fields for the social tab with OpenGraph disabled.
	 *
	 * @covers WPSEO_Taxonomy_Social_Fields::get
	 */
	public function test_get_fields_without_open_graph() {
		// Set opengraph option to false.
		WPSEO_Options::set( 'opengraph', false );

		$fields = $this->get_class_instance()->get();

		// Fields for OpenGraph.
		$this->assertFalse( array_key_exists( 'opengraph-title', $fields ) );
		$this->assertFalse( array_key_exists( 'opengraph-description', $fields ) );
		$this->assertFalse( array_key_exists( 'opengraph-image', $fields ) );

		// Fields for twitter should be there.
		$this->assertTrue( array_key_exists( 'twitter-title', $fields ) );
	}

	/**
	 * Fetching the fields for the social tab with twitter disabled.
	 *
	 * @covers WPSEO_Taxonomy_Social_Fields::get
	 */
	public function test_get_fields_without_twitter() {
		// Set twitter option to false.
		WPSEO_Options::set( 'twitter', false );

		$fields = $this->get_class_instance()->get();

		// Fields for OpenGraph.
		$this->assertFalse( array_key_exists( 'twitter-title', $fields ) );
		$this->assertFalse( array_key_exists( 'twitter-description', $fields ) );
		$this->assertFalse( array_key_exists( 'twitter-image', $fields ) );

		// Fields for opengraph should be there.
		$this->assertTrue( array_key_exists( 'opengraph-title', $fields ) );
	}
}

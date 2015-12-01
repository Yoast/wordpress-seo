<?php
/**
 * @package WPSEO\Unittests
 */

class WPSEO_GooglePlus_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_GooglePlus
	 */
	private static $class_instance;

	public static function setUpBeforeClass() {
		self::$class_instance = new WPSEO_GooglePlus;
	}

	/**
	 * Placeholder test to prevent PHPUnit from throwing errors
	 */
	public function test_class_is_tested() {
		$this->assertTrue( true );
	}

	/**
	 * @covers WPSEO_GooglePlus::description
	 */
	public function test_description() {

		self::$class_instance->description();
		$this->expectOutput( '' );

		// create and go to post
		$post_id = $this->factory->post->create();
		$this->go_to( get_permalink( $post_id ) );

		// should be empty, didn't set google-plus-description
		self::$class_instance->description();
		$this->expectOutput( '' );

		// set meta
		$description = 'Google description';
		WPSEO_Meta::set_value( 'google-plus-description', $description, $post_id );

		// test output
		$expected = '<meta itemprop="description" content="' . $description . '">' . "\n";
		self::$class_instance->description();
		$this->expectOutput( $expected );
	}

	/**
	 * Testing with a custom Google Plus title for the taxonomy
	 *
	 * @covers WPSEO_GooglePlus::google_plus_title
	 */
	public function test_taxonomy_title() {
		$term_id = $this->factory->term->create( array( 'taxonomy' => 'category' ) );

		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'google-plus-title', 'Custom taxonomy google+ title' );

		$this->go_to( get_term_link( $term_id, 'category' ) );

		self::$class_instance->google_plus_title();

		$this->expectOutput( '<meta itemprop="name" content="Custom taxonomy google+ title">' . PHP_EOL );
	}

	/**
	 * Testing with a custom Google Plus description for the taxonomy
	 *
	 * @covers WPSEO_GooglePlus::description
	 */
	public function test_taxonomy_description() {
		$term_id = $this->factory->term->create( array( 'taxonomy' => 'category' ) );

		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'google-plus-description', 'Custom taxonomy google+ description' );

		$this->go_to( get_term_link( $term_id, 'category' ) );

		self::$class_instance->description();

		$this->expectOutput( '<meta itemprop="description" content="Custom taxonomy google+ description">' . PHP_EOL );
	}

	/**
	 * Testing with a custom Google Plus image set for the taxonomy
	 *
	 * @covers WPSEO_GooglePlus::google_plus_image
	 */
	public function test_taxonomy_image() {
		$term_id = $this->factory->term->create( array( 'taxonomy' => 'category' ) );

		WPSEO_Taxonomy_Meta::set_value( $term_id, 'category', 'google-plus-image', home_url( 'custom_google_plus_image.png' ) );

		$this->go_to( get_term_link( $term_id, 'category' ) );

		self::$class_instance->google_plus_image();

		$this->expectOutput( '<meta itemprop="image" content="' . home_url( 'custom_google_plus_image.png' ) . '">' . PHP_EOL );
	}


}
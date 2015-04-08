<?php
/**
 * @package    WPSEO
 * @subpackage Unittests
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

}
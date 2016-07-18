<?php

require_once 'test-class-wpseo-plugin-availability-double.php';

class WPSEO_Plugin_Availability_Test extends WPSEO_UnitTestCase {

	/**
	 * @var WPSEO_Plugin_Availability
	 */
	private static $class_instance;

	/**
	 * Set up our double class
	 */
	public function setUp() {
		parent::setUp();

		self::$class_instance = new WPSEO_Plugin_Availability_Double;
	}

	public function test_plugin_existence() {
		$expected = array(
			'url' => 'https://yoast.com/',
			'title' => 'Test Plugin',
			'description' => '',
			'version' => '3.3',
			'installed' => true
		);

		$this->assertEquals( self::$class_instance->get_plugin( 'test-plugin' ), $expected );
		$this->assertEquals( self::$class_instance->get_plugin( 'non-exisiting-test-plugin' ), array() );
	}

	public function test_plugin_availability() {
		$plugin     = self::$class_instance->get_plugin( 'test-plugin' );
		$available  = self::$class_instance->is_available( $plugin );

		$this->assertTrue( $available );

		$plugin     = self::$class_instance->get_plugin( 'unavailable-test-plugin' );
		$available  = self::$class_instance->is_available( $plugin );

		$this->assertFalse( $available );
	}

	public function test_plugin_is_installed() {
		$plugin     = self::$class_instance->get_plugin( 'test-plugin' );
		$installed  = self::$class_instance->is_installed( $plugin );

		$this->assertTrue( $installed );

		$plugin     = self::$class_instance->get_plugin( 'unavailable-test-plugin' );
		$installed  = self::$class_instance->is_installed( $plugin );

		$this->assertFalse( $installed );
	}

	public function test_plugin_version() {
		$plugin     = self::$class_instance->get_plugin( 'test-plugin' );
		$version    = self::$class_instance->get_version( $plugin );

		$this->assertEquals( $version, '3.3' );

		$plugin     = self::$class_instance->get_plugin( 'test-plugin-no-version' );
		$version    = self::$class_instance->get_version( $plugin );

		$this->assertEquals( $version, '' );
	}

}

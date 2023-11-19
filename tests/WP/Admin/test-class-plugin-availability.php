<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Admin
 */

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Plugin_Availability
 */
class WPSEO_Plugin_Availability_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Plugin_Availability
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 */
	public function set_up() {
		parent::set_up();

		$plugin_availability = new WPSEO_Plugin_Availability_Double();
		$plugin_availability->register();

		self::$class_instance = $plugin_availability;
	}

	/**
	 * Tests whether or not a plugin exists.
	 *
	 * @covers ::get_plugin
	 */
	public function test_plugin_existence() {
		$expected = [
			'url'          => 'http://example.com/',
			'title'        => 'Test Plugin',
			'description'  => '',
			'version'      => '3.3',
			'installed'    => true,
			'slug'         => 'test-plugin/test-plugin.php',
			'version_sync' => true,
		];

		$this->assertEquals( self::$class_instance->get_plugin( 'test-plugin' ), $expected );
		$this->assertEquals( self::$class_instance->get_plugin( 'non-exisiting-test-plugin' ), [] );
	}

	/**
	 * Tests whether or not plugins are available.
	 *
	 * @covers ::get_plugin
	 * @covers ::is_available
	 */
	public function test_plugin_availability() {
		$plugin    = self::$class_instance->get_plugin( 'test-plugin' );
		$available = self::$class_instance->is_available( $plugin );

		$this->assertTrue( $available );

		$plugin    = self::$class_instance->get_plugin( 'unavailable-test-plugin' );
		$available = self::$class_instance->is_available( $plugin );

		$this->assertFalse( $available );
	}

	/**
	 * Tests whether or not plugins are installed.
	 *
	 * @covers ::get_plugin
	 * @covers ::is_installed
	 */
	public function test_plugin_is_installed() {
		$plugin    = self::$class_instance->get_plugin( 'test-plugin' );
		$installed = self::$class_instance->is_installed( $plugin );

		$this->assertTrue( $installed );

		$plugin    = self::$class_instance->get_plugin( 'unavailable-test-plugin' );
		$installed = self::$class_instance->is_installed( $plugin );

		$this->assertFalse( $installed );
	}

	/**
	 * Tests for the plugin version.
	 *
	 * @covers ::get_plugin
	 * @covers ::get_version
	 */
	public function test_plugin_version() {
		$plugin  = self::$class_instance->get_plugin( 'test-plugin' );
		$version = self::$class_instance->get_version( $plugin );

		$this->assertEquals( $version, '3.3' );

		$plugin  = self::$class_instance->get_plugin( 'test-plugin-no-version' );
		$version = self::$class_instance->get_version( $plugin );

		$this->assertEquals( $version, '' );
	}

	/**
	 * Tests for the detection of Premium plugins.
	 *
	 * @covers ::is_premium
	 */
	public function test_plugin_is_premium() {
		$is_premium_plugin = self::$class_instance->is_premium( self::$class_instance->get_plugin( 'test-plugin' ) );

		$this->assertFalse( $is_premium_plugin );

		$is_premium_plugin = self::$class_instance->is_premium( self::$class_instance->get_plugin( 'test-premium-plugin' ) );

		$this->assertTrue( $is_premium_plugin );
	}
}

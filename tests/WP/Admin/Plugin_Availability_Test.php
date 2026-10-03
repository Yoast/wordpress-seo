<?php

namespace Yoast\WP\SEO\Tests\WP\Admin;

use Yoast\WP\SEO\Tests\WP\Doubles\Admin\Plugin_Availability_Double;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Plugin_Availability
 */
final class Plugin_Availability_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Plugin_Availability
	 */
	private static $class_instance;

	/**
	 * Set up our double class.
	 *
	 * @return void
	 */
	public function set_up() {
		parent::set_up();

		$plugin_availability = new Plugin_Availability_Double();
		$plugin_availability->register();

		self::$class_instance = $plugin_availability;
	}

	/**
	 * Tests whether or not plugins are available.
	 *
	 * @covers ::is_available
	 *
	 * @return void
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
	 * @covers ::is_installed
	 *
	 * @return void
	 */
	public function test_plugin_is_installed() {
		$plugin    = self::$class_instance->get_plugin( 'test-plugin' );
		$installed = self::$class_instance->is_installed( $plugin );

		$this->assertTrue( $installed );

		$plugin    = self::$class_instance->get_plugin( 'unavailable-test-plugin' );
		$installed = self::$class_instance->is_installed( $plugin );

		$this->assertFalse( $installed );
	}
}

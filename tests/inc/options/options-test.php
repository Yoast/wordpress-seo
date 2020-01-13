<?php

namespace Yoast\WP\Free\Tests\Inc\Options;

use Brain\Monkey;
use WPSEO_Options;
use Yoast\WP\Free\Tests\Doubles\Inc\Options\Options_Double;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group options
 */
class Options_Test extends TestCase {
	/**
	 * Tests clearing the cache.
	 *
	 * @covers WPSEO_Options::clear_cache
	 */
	public function test_clear_cache() {
		Options_Double::$option_values = '123';

		Options_Double::clear_cache();

		$this->assertEquals(
			null,
			Options_Double::$option_values
		);
	}

	/**
	 * Test getting settings values.
	 *
	 * @covers WPSEO_Options::get
	 */
	public function test_get() {
		$test = Options_Double::get( 'test' );
		$this->assertEquals( $test, false );

		$test = Options_Double::get( 'website_name' );
		$this->assertEquals( $test, '' );
	}

	/**
	 * Test setting settings values.
	 *
	 * @covers WPSEO_Options::set
	 */
	public function test_set() {
		$this->assertEquals( '', Options_Double::get( 'website_name' ) );

		Options_Double::set( 'website_name', 'Yoast' );
		$this->assertEquals( 'Yoast', Options_Double::get( 'website_name' ) );
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$instance = new Options_Double();
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'registered_taxonomy', [ $instance, 'clear_cache' ] ) );
		$this->assertNotFalse( \has_action( 'registered_post_type', [ $instance, 'clear_cache' ] ) );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc\Options;

use Yoast\WP\SEO\Tests\Unit\Doubles\Inc\Options\Options_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \WPSEO_Options
 *
 * @group options
 */
final class Options_Test extends TestCase {

	/**
	 * Tests clearing the cache.
	 *
	 * @covers ::clear_cache
	 *
	 * @return void
	 */
	public function test_clear_cache() {
		Options_Double::$option_values = '123';

		Options_Double::clear_cache();

		$this->assertNull( Options_Double::$option_values );
	}

	/**
	 * Test getting settings values.
	 *
	 * @covers ::get
	 *
	 * @return void
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
	 * @covers ::set
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$instance = new Options_Double();
		$instance->register_hooks();

		$this->assertNotFalse( \has_action( 'registered_taxonomy', [ $instance, 'clear_cache' ] ) );
		$this->assertNotFalse( \has_action( 'registered_post_type', [ $instance, 'clear_cache' ] ) );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc\Options;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Inc\Options\Options_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \WPSEO_Options
 *
 * @group options
 */
class Options_Test extends TestCase {

	/**
	 * Holds the options helper instance.
	 *
	 * @var Options_Helper|Mockery\Mock
	 */
	protected $options_helper;

	/**
	 * Sets up the test fixtures.
	 */
	public function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		Monkey\Functions\expect( 'YoastSEO' )->andReturn(
			(object) [
				'helpers' =>
					(object) [
						'options' => $this->options_helper,
					],
			]
		);
	}

	/**
	 * Tests clearing the cache.
	 *
	 * @covers ::clear_cache
	 */
	public function test_clear_cache() {
		$this->options_helper
			->expects( 'clear_cache' )
			->once();

		Options_Double::$option_values = '123';

		Options_Double::clear_cache();

		$this->assertNull( Options_Double::$option_values );
	}

	/**
	 * Test get calls the Options_Helper.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->options_helper
			->expects( 'get' )
			->with( 'website_name', null );

		$this->assertNull( Options_Double::get( 'website_name' ) );
	}

	/**
	 * Test set calls the Options_Helper.
	 *
	 * @covers ::set
	 */
	public function test_set() {
		$this->options_helper
			->expects( 'set' )
			->with( 'website_name', 'Yoast' );

		Options_Double::set( 'website_name', 'Yoast' );
	}
}

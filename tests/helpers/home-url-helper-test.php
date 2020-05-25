<?php

namespace Yoast\WP\SEO\Tests\Helpers;

use Brain\Monkey;
use Yoast\WP\SEO\Helpers\Home_Url_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Home_Url_Helper
 *
 * @group helpers
 */
class Home_Url_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Home_Url_Helper
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Home_Url_Helper();
	}

	/**
	 * Tests retrieval of the home url.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		Monkey\Functions\expect( 'home_url' )
			->once()
			->andReturn( 'https://example.com' );

		$this->assertEquals( 'https://example.com', $this->instance->get() );
	}

	/**
	 * Tests retrieval of the home url with the home url being cached.
	 *
	 * @covers ::get
	 */
	public function test_get_cached() {
		Monkey\Functions\expect( 'home_url' )
			->never();

		$this->assertEquals( 'https://example.com', $this->instance->get() );
	}

	/**
	 * Tests retrieval of the parsed home url.
	 *
	 * @covers ::get_parsed
	 */
	public function test_get_parsed() {
		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( 'https://example.com' )
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.com',
				]
			);

		$this->assertEquals(
			[
				'scheme' => 'https',
				'host'   => 'example.com',
			],
			$this->instance->get_parsed()
		);
	}

	/**
	 * Tests retrieval of the parsed url with the value begin cached.
	 *
	 * @covers ::get_parsed
	 */
	public function test_get_parsed_cached() {
		Monkey\Functions\expect( 'wp_parse_url' )
			->never();

		$this->assertEquals(
			[
				'scheme' => 'https',
				'host'   => 'example.com',
			],
			$this->instance->get_parsed()
		);
	}
}

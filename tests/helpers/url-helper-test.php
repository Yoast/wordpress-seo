<?php

namespace Yoast\WP\Free\Tests\Helpers;

use Brain\Monkey;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Url_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\Free\Helpers\Url_Helper
 */
class Url_Helper_Test extends TestCase {

	/**
	 * @var Url_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Url_Helper();
	}

	/**
	 * @covers ::build_absolute_url
	 */
	public function test_build_absolute_url() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'home_url' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->withArgs( [ '/my-page', PHP_URL_PATH ] )
			->andReturn( '/my-page' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->withArgs( [ 'home_url' ] )
			->andReturn( [
				'scheme' => 'https',
				'host'   => 'example.com',
			] );

		$expected = 'https://example.com/my-page';
		$actual   = $this->instance->build_absolute_url( '/my-page' );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * @covers ::build_absolute_url
	 */
	public function test_build_absolute_url_relative_url() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'home_url' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->withArgs( [ 'https://example.com/my-page', PHP_URL_PATH ] )
			->andReturn( '/my-page' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->withArgs( [ 'home_url' ] )
			->andReturn( [
				'scheme' => 'https',
				'host'   => 'example.com',
			] );

		$expected = 'https://example.com/my-page';
		$actual   = $this->instance->build_absolute_url( 'https://example.com/my-page' );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * @covers ::get_extension_from_url
	 * @covers ::get_url_path
	 */
	public function test_get_extension_from_url() {
		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.com/image.jpg', PHP_URL_PATH )
			->andReturn( '/image.jpg' );

		$expected = 'jpg';
		$actual   = $this->instance->get_extension_from_url( 'https://example.com/image.jpg' );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * @covers ::get_extension_from_url
	 * @covers ::get_url_path
	 */
	public function test_get_extension_from_url_no_path() {
		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.com', PHP_URL_PATH )
			->andReturn( '' );

		$expected = '';
		$actual   = $this->instance->get_extension_from_url( 'https://example.com' );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * @covers ::get_extension_from_url
	 * @covers ::get_url_path
	 */
	public function test_get_extension_from_url_no_extension() {
		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.com/path', PHP_URL_PATH )
			->andReturn( 'path' );

		$expected = '';
		$actual   = $this->instance->get_extension_from_url( 'https://example.com/path' );

		$this->assertEquals( $expected, $actual );
	}
}

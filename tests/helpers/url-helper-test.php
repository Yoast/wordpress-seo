<?php

namespace Yoast\WP\SEO\Tests\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Url_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Url_Helper
 */
class Url_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Url_Helper|Mockery::mock
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Url_Helper::class )->makePartial();
	}

	/**
	 * Tests the building of an absolute url.
	 *
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
	 * Tests the building of an absolute url with a relative url given.
	 *
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
	 * Tests retrieving of the file extension.
	 *
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
	 * Tests retrieving of the file extension with no path present.
	 *
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
	 * Tests retrieving of the file extension with no extension present.
	 *
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

	/**
	 * Tests the ensure absolute url with an array given as argument.
	 *
	 * @covers ::ensure_absolute_url
	 */
	public function test_ensure_absolute_url_with_array_given() {
		$this->assertEquals( [ 'array' ], $this->instance->ensure_absolute_url( [ 'array' ] ) );
	}

	/**
	 * Tests the ensure absolute url with an array given as argument.
	 *
	 * @covers ::ensure_absolute_url
	 */
	public function test_ensure_absolute_url_with_empty_string_given() {
		$this->assertEquals( '', $this->instance->ensure_absolute_url( '' ) );
	}

	/**
	 * Tests the ensure absolute url with a relative url given as argument.
	 *
	 * @covers ::ensure_absolute_url
	 */
	public function test_ensure_absolute_url_with_relative_url_given() {
		$this->instance
			->expects( 'is_relative' )
			->once()
			->with( 'page' )
			->andReturnTrue();

		$this->instance
			->expects( 'build_absolute_url' )
			->once()
			->with( 'page' )
			->andReturn( 'https://example.org/page' );

		$this->assertEquals( 'https://example.org/page', $this->instance->ensure_absolute_url( 'page' ) );
	}

	/**
	 * Tests the ensure absolute url with an absolute url given as argument.
	 *
	 * @covers ::ensure_absolute_url
	 */
	public function test_ensure_absolute_url_with_absolute_url_given() {
		$this->instance
			->expects( 'is_relative' )
			->once()
			->with( 'https://example.org/page' )
			->andReturnFalse();

		$this->assertEquals( 'https://example.org/page', $this->instance->ensure_absolute_url( 'https://example.org/page' ) );
	}
}

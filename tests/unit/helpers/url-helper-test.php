<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
			->withArgs( [ '/my-page', \PHP_URL_PATH ] )
			->andReturn( '/my-page' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->withArgs( [ 'home_url' ] )
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.com',
				]
			);

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
			->withArgs( [ 'https://example.com/my-page', \PHP_URL_PATH ] )
			->andReturn( '/my-page' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->withArgs( [ 'home_url' ] )
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.com',
				]
			);

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
			->with( 'https://example.com/image.jpg', \PHP_URL_PATH )
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
			->with( 'https://example.com', \PHP_URL_PATH )
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
			->with( 'https://example.com/path', \PHP_URL_PATH )
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

	/**
	 * Tests if an url is relative with a relative url given as argument.
	 *
	 * @covers ::is_relative
	 */
	public function test_if_url_is_relative() {
		$this->assertTrue( $this->instance->is_relative( '/relative.html' ) );
	}

	/**
	 * Tests if an url is relative with a relative url given as argument.
	 *
	 * @covers ::is_relative
	 */
	public function test_if_url_is_relative_with_non_relative_url_given() {
		$this->assertFalse( $this->instance->is_relative( 'https://relative.html' ) );
	}

	/**
	 * Tests if an url is relative with a protocol-less url given as argument.
	 *
	 * @covers ::is_relative
	 */
	public function test_if_url_is_relative_with_protocol_less_url_given() {
		$this->assertFalse( $this->instance->is_relative( '//relative.html' ) );
	}

	/**
	 * Tests the home url with a path given.
	 *
	 * @covers ::home
	 */
	public function test_home_with_path_given() {
		Monkey\Functions\expect( 'home_url' )
			->with( 'path' )
			->andReturn( 'https://example.org/path' );

		$this->assertEquals( 'https://example.org/path', $this->instance->home( 'path' ) );
	}

	/**
	 * Tests the home url with no path given and home url is site root.
	 *
	 * @covers ::home
	 */
	public function test_home_with_home_at_site_root() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.org/', PHP_URL_PATH )
			->andReturn( null );

		Monkey\Functions\expect( 'trailingslashit' )
			->with( 'https://example.org' )
			->andReturn( 'https://example.org/' );

		$this->assertEquals( 'https://example.org/', $this->instance->home() );
	}

	/**
	 * Tests the home url with no path given and home url is site root.
	 *
	 * @covers ::home
	 */
	public function test_home_with_home_at_site_root_already_slashed() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.org/' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.org/', PHP_URL_PATH )
			->andReturn( '/' );

		$this->assertEquals( 'https://example.org/', $this->instance->home() );
	}

	/**
	 * Tests the home url with the home in a subdirectory.
	 *
	 * @covers ::home
	 */
	public function test_home_with_home_in_subdirectory() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.org/', PHP_URL_PATH )
			->andReturn( 'https://example.org/subdirectory' );

		Monkey\Functions\expect( 'user_trailingslashit' )
			->with( 'https://example.org' )
			->andReturn( 'https://example.org/' );

		$this->assertEquals( 'https://example.org/', $this->instance->home() );
	}


	/**
	 * Tests the home url with the home in a subdirectory.
	 *
	 * @covers ::home
	 */
	public function test_home() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.org/', PHP_URL_PATH )
			->andReturn( false );

		$this->assertEquals( 'https://example.org', $this->instance->home() );
	}
}

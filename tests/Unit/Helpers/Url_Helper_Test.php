<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use stdClass;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Tests\Unit\Doubles\Stringable_Object_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Url_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Url_Helper
 */
final class Url_Helper_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Url_Helper|Mockery
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Url_Helper();
	}

	/**
	 * Tests the building of an absolute url.
	 *
	 * @covers ::build_absolute_url
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_build_absolute_url_relative_url() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.com' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->withArgs( [ 'https://example.com/my-page', \PHP_URL_PATH ] )
			->andReturn( '/my-page' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->withArgs( [ 'https://example.com' ] )
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
	 * Tests that get_url_path() always returns a string and handles unexpected input gracefully.
	 *
	 * @dataProvider data_get_url_path
	 *
	 * @covers ::get_url_path
	 *
	 * @param mixed  $url_input Input to pass to the get_url_path() function.
	 * @param string $expected  Output expected from the get_url_path() function.
	 *
	 * @return void
	 */
	public function test_get_url_path( $url_input, $expected ) {
		Monkey\Functions\stubs(
			[
				'wp_parse_url' => static function ( $url, $component ) {
					// phpcs:ignore WordPress.WP.AlternativeFunctions.parse_url_parse_url -- Mocking wp_parse_url(), this is fine.
					return \parse_url( $url, $component );
				},
			]
		);

		$this->assertSame( $expected, $this->instance->get_url_path( $url_input ) );
	}

	/**
	 * Data provider for test_get_url_path.
	 *
	 * @return array
	 */
	public static function data_get_url_path() {
		return [
			'URL is an empty string' => [
				'url_input' => '',
				'expected'  => '',
			],
			'URL with domain, no path' => [
				'url_input' => 'https://example.com',
				'expected'  => '',
			],
			'URL with domain, path is only slash' => [
				'url_input' => 'https://example.com/',
				'expected'  => '/',
			],
			'URL with domain and full path' => [
				'url_input' => 'https://example.com/this/is/the/path',
				'expected'  => '/this/is/the/path',
			],
			'URL with domain and full path and trailing slash' => [
				'url_input' => 'https://example.com/this/is/the/path/',
				'expected'  => '/this/is/the/path/',
			],
			'URL with domain, no path via a stringable object' => [
				'url_input' => new Stringable_Object_Mock( 'https://example.com' ),
				'expected'  => '',
			],
			'URL with domain and full path via a stringable object' => [
				'url_input' => new Stringable_Object_Mock( 'https://example.com/this/is/the/path' ),
				'expected'  => '/this/is/the/path',
			],
			'URL is not a string: null' => [
				'url_input' => null,
				'expected'  => '',
			],
			'URL is not a string: boolean true' => [
				'url_input' => true,
				'expected'  => '',
			],
			'URL is not a string: array' => [
				'url_input' => [],
				'expected'  => '',
			],
			'URL is not a string: object, but not stringable' => [
				'url_input' => new stdClass(),
				'expected'  => '',
			],
		];
	}

	/**
	 * Tests that get_url_host() always returns a string and handles unexpected input gracefully.
	 *
	 * @dataProvider data_get_url_host
	 *
	 * @covers ::get_url_host
	 *
	 * @param mixed  $url_input Input to pass to the get_url_host() function.
	 * @param string $expected  Output expected from the get_url_host() function.
	 *
	 * @return void
	 */
	public function test_get_url_host( $url_input, $expected ) {
		Monkey\Functions\stubs(
			[
				'wp_parse_url' => static function ( $url, $component ) {
					// phpcs:ignore WordPress.WP.AlternativeFunctions.parse_url_parse_url -- Mocking wp_parse_url(), this is fine.
					return \parse_url( $url, $component );
				},
			]
		);

		$this->assertSame( $expected, $this->instance->get_url_host( $url_input ) );
	}

	/**
	 * Data provider for test_get_url_host.
	 *
	 * @return array
	 */
	public static function data_get_url_host() {
		return [
			'URL is an empty string' => [
				'url_input' => '',
				'expected'  => '',
			],
			'URL with domain' => [
				'url_input' => 'https://example.com',
				'expected'  => 'example.com',
			],
			'URL with domain, and subdomain' => [
				'url_input' => 'https://foo.example.com',
				'expected'  => 'foo.example.com',
			],
			'URL with domain, path is only slash' => [
				'url_input' => 'https://example.com/',
				'expected'  => 'example.com',
			],
			'URL with domain and full path' => [
				'url_input' => 'https://example.com/this/is/the/path',
				'expected'  => 'example.com',
			],
			'URL with domain and full path and trailing slash' => [
				'url_input' => 'https://foo.example.com/this/is/the/path/',
				'expected'  => 'foo.example.com',
			],
			'URL with domain, no path via a stringable object' => [
				'url_input' => new Stringable_Object_Mock( 'https://example.com' ),
				'expected'  => 'example.com',
			],
			'URL is not a string: null' => [
				'url_input' => null,
				'expected'  => '',
			],
			'URL is not a string: boolean true' => [
				'url_input' => true,
				'expected'  => '',
			],
			'URL is not a string: array' => [
				'url_input' => [],
				'expected'  => '',
			],
			'URL is not a string: object, but not stringable' => [
				'url_input' => new stdClass(),
				'expected'  => '',
			],
		];
	}

	/**
	 * Tests retrieving of the file extension.
	 *
	 * @covers ::get_extension_from_url
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_ensure_absolute_url_with_array_given() {
		$this->assertEquals( [ 'array' ], $this->instance->ensure_absolute_url( [ 'array' ] ) );
	}

	/**
	 * Tests the ensure absolute url with an array given as argument.
	 *
	 * @covers ::ensure_absolute_url
	 *
	 * @return void
	 */
	public function test_ensure_absolute_url_with_empty_string_given() {
		$this->assertEquals( '', $this->instance->ensure_absolute_url( '' ) );
	}

	/**
	 * Tests the ensure absolute url with a relative url given as argument.
	 *
	 * @covers ::ensure_absolute_url
	 * @covers ::is_relative
	 *
	 * @return void
	 */
	public function test_ensure_absolute_url_with_relative_url_given() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.com' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->withArgs( [ 'page', \PHP_URL_PATH ] )
			->andReturn( 'page' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->withArgs( [ 'https://example.com' ] )
			->andReturn(
				[
					'scheme' => 'https',
					'host'   => 'example.com',
				]
			);

		$this->assertEquals( 'https://example.com/page', $this->instance->ensure_absolute_url( 'page' ) );
	}

	/**
	 * Tests the ensure absolute url with an absolute url given as argument.
	 *
	 * @covers ::ensure_absolute_url
	 * @covers ::is_relative
	 *
	 * @return void
	 */
	public function test_ensure_absolute_url_with_absolute_url_given() {
		$this->assertEquals( 'https://example.org/page', $this->instance->ensure_absolute_url( 'https://example.org/page' ) );
	}

	/**
	 * Tests if an url is relative with a relative url given as argument.
	 *
	 * @covers ::is_relative
	 *
	 * @return void
	 */
	public function test_if_url_is_relative() {
		$this->assertTrue( $this->instance->is_relative( '/relative.html' ) );
	}

	/**
	 * Tests if an url is relative with a relative url given as argument.
	 *
	 * @covers ::is_relative
	 *
	 * @return void
	 */
	public function test_if_url_is_relative_with_non_relative_url_given() {
		$this->assertFalse( $this->instance->is_relative( 'https://relative.html' ) );
	}

	/**
	 * Tests if an url is relative with a protocol-less url given as argument.
	 *
	 * @covers ::is_relative
	 *
	 * @return void
	 */
	public function test_if_url_is_relative_with_protocol_less_url_given() {
		$this->assertFalse( $this->instance->is_relative( '//relative.html' ) );
	}

	/**
	 * Tests the home url with a path given.
	 *
	 * @covers ::home
	 *
	 * @return void
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
	 *
	 * @return void
	 */
	public function test_home_with_home_at_site_root() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.org/', \PHP_URL_PATH )
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
	 *
	 * @return void
	 */
	public function test_home_with_home_at_site_root_already_slashed() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.org/' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.org/', \PHP_URL_PATH )
			->andReturn( '/' );

		$this->assertEquals( 'https://example.org/', $this->instance->home() );
	}

	/**
	 * Tests the home url with the home in a subdirectory.
	 *
	 * @covers ::home
	 *
	 * @return void
	 */
	public function test_home_with_home_in_subdirectory() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.org/', \PHP_URL_PATH )
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
	 *
	 * @return void
	 */
	public function test_home() {
		Monkey\Functions\expect( 'home_url' )
			->andReturn( 'https://example.org' );

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.org/', \PHP_URL_PATH )
			->andReturn( false );

		$this->assertEquals( 'https://example.org', $this->instance->home() );
	}

	/**
	 * Tests the get_link_type function.
	 *
	 * @covers ::get_link_type
	 *
	 * @dataProvider get_link_type_test_data
	 *
	 * @param array  $url       The parsed url.
	 * @param array  $home_url  The parsed home url.
	 * @param bool   $is_image  Whether or not the link is an image.
	 * @param string $link_type The expected link type.
	 * @param string $message   The assertion message.
	 *
	 * @return void
	 */
	public function test_get_link_type( $url, $home_url, $is_image, $link_type, $message ) {
		if ( \is_null( $home_url ) ) {
			Monkey\Functions\expect( 'home_url' )
				->once()
				->andReturn( 'home_url' );
			Monkey\Functions\expect( 'wp_parse_url' )
				->once()
				->with( 'home_url' )
				->andReturn( [ 'host' => 'example.com' ] );
		}

		$this->assertEquals(
			$link_type,
			$this->instance->get_link_type( $url, $home_url, $is_image ),
			$message
		);
	}

	/**
	 * Data for the get_link_type_test.
	 *
	 * @return array The test data.
	 */
	public static function get_link_type_test_data() {
		return [
			[
				[
					'scheme' => '',
					'host'   => '',
				],
				[],
				false,
				SEO_Links::TYPE_INTERNAL,
				'URLs with no scheme and no host should be internal',
			],
			[
				[
					'scheme' => '',
					'host'   => 'example.net',
				],
				[
					'scheme' => 'http',
					'host'   => 'example.com',
				],
				false,
				SEO_Links::TYPE_EXTERNAL,
				'URLs with no scheme, but an external host should be external',
			],
			[
				[ 'scheme' => 'not-http(s)?' ],
				[],
				false,
				SEO_Links::TYPE_EXTERNAL,
				'URLs with a non http(s)? scheme should be external',
			],
			[
				[
					'scheme' => 'http',
					'host'   => 'not-example.com',
				],
				null,
				false,
				SEO_Links::TYPE_EXTERNAL,
				'When no home_url is passed home_url and wp_parse_url should be called',
			],
			[
				[
					'scheme' => 'http',
					'host'   => 'example.com',
					'path'   => 'test',
				],
				[
					'scheme' => 'http',
					'host'   => 'example.com',
				],
				false,
				SEO_Links::TYPE_INTERNAL,
				'When home_url has no path and the hosts match the URL should be internal',
			],
			[
				[
					'scheme' => 'http',
					'host'   => 'example.com',
					'path'   => 'test',
				],
				[
					'scheme' => 'http',
					'host'   => 'example.com',
					'path'   => 'home',
				],
				false,
				SEO_Links::TYPE_EXTERNAL,
				'When home_url has a path URLs that don\'t start with it should be external',
			],
			[
				[
					'scheme' => 'http',
					'host'   => 'example.com',
					'path'   => 'home/test',
				],
				[
					'scheme' => 'http',
					'host'   => 'example.com',
					'path'   => 'home',
				],
				false,
				SEO_Links::TYPE_INTERNAL,
				'When home_url has a path URLs that do start with it should be internal',
			],
		];
	}

	/**
	 * Tests the recreate_current_url function.
	 *
	 * @covers ::recreate_current_url
	 *
	 * @dataProvider recreate_current_url_test_data
	 *
	 * @param array  $params   The input parameters.
	 * @param string $expected The expected output.
	 *
	 * @return void
	 */
	public function test_recreate_current_url( $params, $expected ) {
		if ( ! empty( $params['HTTPS'] ) ) {
			$_SERVER['HTTPS'] = $params['HTTPS'];
		}

		if ( ! empty( $params['REQUEST_URI'] ) ) {
			$_SERVER['REQUEST_URI'] = $params['REQUEST_URI'];
		}

		if ( ! empty( $params['SERVER_NAME'] ) ) {
			$_SERVER['SERVER_NAME'] = $params['SERVER_NAME'];
		}

		if ( ! empty( $params['SERVER_PORT'] ) ) {
			$_SERVER['SERVER_PORT'] = $params['SERVER_PORT'];
		}

		$this->assertSame(
			$expected,
			$this->instance->recreate_current_url( $params['with_request_uri'] )
		);

		if ( ! empty( $params['HTTPS'] ) ) {
			unset( $_SERVER['HTTPS'] );
		}

		if ( ! empty( $params['REQUEST_URI'] ) ) {
			unset( $_SERVER['REQUEST_URI'] );
		}

		if ( ! empty( $params['SERVER_NAME'] ) ) {
			unset( $_SERVER['SERVER_NAME'] );
		}

		if ( ! empty( $params['SERVER_PORT'] ) ) {
			unset( $_SERVER['SERVER_PORT'] );
		}
	}

	/**
	 * Data for the test_recreate_current_url.
	 *
	 * @return array The test data.
	 */
	public static function recreate_current_url_test_data() {
		return [
			'HTTP with request uri' => [
				'params'   => [
					'with_request_uri' => true,
					'REQUEST_URI'      => '/path',
					'SERVER_NAME'      => 'foobar.tld',
				],
				'expected' => 'http://foobar.tld/path',
			],
			'HTTP without request uri' => [
				'params'   => [
					'with_request_uri' => false,
					'REQUEST_URI'      => '/path',
					'SERVER_NAME'      => 'foobar.tld',
				],
				'expected' => 'http://foobar.tld',
			],
			'HTTPS with request uri' => [
				'params'   => [
					'with_request_uri' => true,
					'HTTPS'            => 'on',
					'REQUEST_URI'      => '/path',
					'SERVER_NAME'      => 'foobar.tld',
				],
				'expected' => 'https://foobar.tld/path',
			],
			'HTTPS without request uri' => [
				'params'   => [
					'with_request_uri' => false,
					'HTTPS'            => 'on',
					'REQUEST_URI'      => '/path',
					'SERVER_NAME'      => 'foobar.tld',
				],
				'expected' => 'https://foobar.tld',
			],
			'HTTP with port and request uri' => [
				'params'   => [
					'with_request_uri' => true,
					'REQUEST_URI'      => '/path',
					'SERVER_NAME'      => 'foobar.tld',
					'SERVER_PORT'      => '8080',
				],
				'expected' => 'http://foobar.tld:8080/path',
			],
			'HTTP with port and without request uri' => [
				'params'   => [
					'with_request_uri' => false,
					'REQUEST_URI'      => '/path',
					'SERVER_NAME'      => 'foobar.tld',
					'SERVER_PORT'      => '8080',
				],
				'expected' => 'http://foobar.tld:8080',
			],
			'No server name with request uri' => [
				'params'   => [
					'with_request_uri' => true,
					'REQUEST_URI'      => '/path',
					'SERVER_PORT'      => '8080',
				],
				'expected' => '/path',
			],
			'Empty server name with request uri' => [
				'params'   => [
					'with_request_uri' => true,
					'REQUEST_URI'      => '/path',
					'SERVER_NAME'      => '',
					'SERVER_PORT'      => '8080',
				],
				'expected' => '/path',
			],
			'No server name with no request uri' => [
				'params'   => [
					'with_request_uri' => false,
					'REQUEST_URI'      => '/path',
					'SERVER_PORT'      => '8080',
				],
				'expected' => '',
			],
		];
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Models\SEO_Links;
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
	 * @var Url_Helper|Mockery
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

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
	 * Tests retrieving of the file extension.
	 *
	 * @covers ::get_extension_from_url
	 * @covers ::get_url_path
	 */
	public function test_get_extension_from_url_null() {
		Monkey\Functions\expect( 'wp_parse_url' )
			->with( 'https://example.com', \PHP_URL_PATH )
			->andReturn( null );

		$expected = '';
		$actual   = $this->instance->get_extension_from_url( 'https://example.com' );

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
	public function get_link_type_test_data() {
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
}

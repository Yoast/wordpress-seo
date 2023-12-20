<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use WP_Query;
use WP_Rewrite;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;
use Yoast\WP\SEO\Wrappers\WP_Rewrite_Wrapper;

/**
 * Class Pagination_Helper_Test.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Pagination_Helper
 */
final class Pagination_Helper_Test extends TestCase {

	/**
	 * Class instance to use for the test.
	 *
	 * @var Pagination_Helper
	 */
	protected $instance;

	/**
	 * Holds the WP rewrite wrapper instance.
	 *
	 * @var WP_Rewrite_Wrapper|Mockery\MockInterface
	 */
	protected $wp_rewrite_wrapper;

	/**
	 * Holds the WP query wrapper instance.
	 *
	 * @var WP_Query_Wrapper|Mockery\MockInterface
	 */
	protected $wp_query_wrapper;

	/**
	 * Sets up the test class.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->wp_rewrite_wrapper = Mockery::mock( WP_Rewrite_Wrapper::class );
		$this->wp_query_wrapper   = Mockery::mock( WP_Query_Wrapper::class );

		$this->instance = new Pagination_Helper( $this->wp_rewrite_wrapper, $this->wp_query_wrapper );
	}

	/**
	 * Tears down the test class.
	 *
	 * @return void
	 */
	protected function tear_down() {
		parent::tear_down();

		$_GET = [];
	}

	/**
	 * Tests if given dependencies are set as expected.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			WP_Rewrite_Wrapper::class,
			$this->getPropertyValue( $this->instance, 'wp_rewrite_wrapper' )
		);
		$this->assertInstanceOf(
			WP_Query_Wrapper::class,
			$this->getPropertyValue( $this->instance, 'wp_query_wrapper' )
		);
	}

	/**
	 * Tests that `is_disabled` returns false by default.
	 *
	 * @covers ::is_rel_adjacent_disabled
	 *
	 * @return void
	 */
	public function test_is_disabled_false() {
		Monkey\Filters\expectApplied( 'wpseo_disable_adjacent_rel_links' )
			->with( false );

		$actual = $this->instance->is_rel_adjacent_disabled();

		$this->assertFalse( $actual );
	}

	/**
	 * Tests that `is_disabled` returns true if the `wpseo_disable_adjacent_rel_links` filter is applied with true.
	 *
	 * @covers ::is_rel_adjacent_disabled
	 *
	 * @return void
	 */
	public function test_is_disabled_true() {
		Monkey\Filters\expectApplied( 'wpseo_disable_adjacent_rel_links' )
			->with( false )
			->andReturn( true );

		$actual = $this->instance->is_rel_adjacent_disabled();

		$this->assertTrue( $actual );
	}

	/**
	 * Data provider for the test_get_paginated_url test using permalinks.
	 *
	 * @return array
	 */
	public static function data_provider_get_paginated_url_use_permalinks() {
		return [
			'using_permalinks_without_pagination_base' => [
				'url'             => 'https://example.com/my-post/',
				'parsed_url'      => [
					'scheme' => 'https',
					'host'   => 'example.com',
					'path'   => 'my-post',
				],
				'page'            => 2,
				'pagination_base' => false,
				'expected'        => 'https://example.com/my-post/2/',
			],
			'using_permalinks_with_pagination_base' => [
				'url'             => 'https://example.com/my-post/',
				'parsed_url'      => [
					'scheme' => 'https',
					'host'   => 'example.com',
					'path'   => 'my-post/page',
				],
				'page'            => 2,
				'pagination_base' => true,
				'expected'        => 'https://example.com/my-post/page/2/',
			],
		];
	}

	/**
	 * Tests that `get_paginated_url` returns the url without a url parameter.
	 *
	 * @covers ::get_paginated_url
	 *
	 * @dataProvider data_provider_get_paginated_url_use_permalinks
	 *
	 * @param string $url             The url to use.
	 * @param array  $parsed_url      The parsed url.
	 * @param int    $page            The page number.
	 * @param bool   $pagination_base Whether to add the pagination base.
	 * @param string $expected        The expected url.
	 *
	 * @return void
	 */
	public function test_get_paginated_url_using_permalink( $url, $parsed_url, $page, $pagination_base, $expected ) {
		$this->using_permalinks( true );

		Monkey\Functions\expect( 'wp_parse_url' )
			->once()
			->with( $url )
			->andReturn( $parsed_url );

		$result = $this->instance->get_paginated_url( $url, $page, $pagination_base );

		$this->assertEquals( $expected, $result );
	}

	/**
	 * Data provider for the test_get_paginated_url test not using permalinks.
	 *
	 * @return array
	 */
	public static function data_provider_get_paginated_url_not_using_permalinks() {
		return [
			'url with query' => [
				'url'                 => 'https://example.com/my-post/',
				'page'                => 2,
				'key'                 => 'page',
				'add_pagination_base' => true,
				'get'                 => [],
				'expected'            => 'https://example.com/my-post?page=2',
			],
			'with_custom_pagination_query_name' => [
				'url'                 => 'https://example.com/my-post/',
				'page'                => 2,
				'key'                 => 'custom',
				'add_pagination_base' => false,
				'get'                 => [],
				'expected'            => 'https://example.com/my-post?custom=2',
			],
		];
	}

	/**
	 * Tests that `get_paginated_url` returns the url with a url parameter.
	 *
	 * @covers ::get_paginated_url
	 *
	 * @dataProvider data_provider_get_paginated_url_not_using_permalinks
	 *
	 * @param string $url                 The url to use.
	 * @param int    $page                The page number.
	 * @param string $key                 The key to use.
	 * @param bool   $add_pagination_base Whether to add the pagination base.
	 * @param array  $get                 The get array.
	 * @param string $expected            The expected url.
	 *
	 * @return void
	 */
	public function test_get_paginated_url_not_using_permalinks( $url, $page, $key, $add_pagination_base, $get, $expected ) {
		$this->using_permalinks( false );

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with( $key, $page, $url )
			->andReturn( $expected );

		$actual = $this->instance->get_paginated_url( $url, $page, $add_pagination_base, $key );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Data provider for the test_get_paginated_url test using permalinks.
	 *
	 * @return array
	 */
	public static function data_provider_get_paginated_url_with_query_loop_param() {
		return [
			'with using permalink' => [
				'using_permalinks' => true,
				'expected'         => 'https://example.com/my-post/?query-1-page=2',
			],
			'without using permalink' => [
				'using_permalinks' => false,
				'expected'         => 'https://example.com/my-post/?query-1-page=2',
			],
		];
	}

	/**
	 * Tests that `get_paginated_url` returns the url with a url parameter when using query loop block.
	 *
	 * @covers ::get_paginated_url
	 *
	 * @dataProvider data_provider_get_paginated_url_with_query_loop_param
	 *
	 * @param bool   $using_permalinks Whether to use permalinks.
	 * @param string $expected         The expected url.
	 *
	 * @return void
	 */
	public function test_get_paginated_url_with_query_loop_param( $using_permalinks, $expected ) {
		$this->using_permalinks( $using_permalinks );

		$_GET        = [ 'query-1-page' => 2 ];
		$url         = 'https://example.com/my-post/';
		$page_number = 2;

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with( 'query-1-page', $page_number, $url )
			->andReturn( $expected );

		$actual = $this->instance->get_paginated_url( $url, $page_number );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that get_number_of_archive_pages retrieves `max_number_pages` from the query as integer.
	 *
	 * @covers ::get_number_of_archive_pages
	 *
	 * @return void
	 */
	public function test_get_number_of_archive_pages() {
		$wp_query                = Mockery::mock( WP_Query::class );
		$wp_query->max_num_pages = '6';

		$this->wp_query_wrapper
			->expects( 'get_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertEquals( 6, $this->instance->get_number_of_archive_pages() );
	}

	/**
	 * Data provider for the test_get_current_archive_page_number test.
	 *
	 * @return array
	 */
	public static function data_provider_get_current_archive_page_number() {
		return [
			'query_var page number' => [
				'query_var_paged' => '2',
				'get'             => [],
				'expected'        => 2,
			],
			'No query_var page number' => [
				'query_var_paged' => '0',
				'get'             => [],
				'expected'        => 0,
			],
			'No query page number' => [
				'query_var_paged' => '0',
				'get'             => [ 'query-1-page' => '2' ],
				'expected'        => 2,
			],
		];
	}

	/**
	 * Tests that get_current_archive_page_number retrieves `paged` from the query as integer.
	 *
	 * @covers ::get_current_archive_page_number
	 *
	 * @dataProvider data_provider_get_current_archive_page_number
	 *
	 * @param string $query_var_paged The query var paged.
	 * @param array  $get             The get array.
	 * @param int    $expected        The expected page number.
	 *
	 * @return void
	 */
	public function test_get_current_archive_page_number( $query_var_paged, $get, $expected ) {
		$wp_query = Mockery::mock( WP_Query::class );
		$wp_query->expects( 'get' )->with( 'paged' )->once()->andReturn( $query_var_paged );

		$_GET = $get;

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertEquals( $expected, $this->instance->get_current_archive_page_number() );
	}

	/**
	 * Data provider for the test_get_current_post_page_number test.
	 *
	 * @return array
	 */
	public static function data_provider_get_current_post_page_number() {
		return [
			'query_var page number' => [
				'query_var_paged'    => '2',
				'get'                => [],
				'wp_query_get_times' => 1,
				'expected'           => 2,
			],
			'No query_var page number' => [
				'query_var_paged'    => '0',
				'get'                => [],
				'wp_query_get_times' => 1,
				'expected'           => 0,
			],
			'No query page number' => [
				'query_var_paged'    => '0',
				'get'                => [ 'query-1-page' => '2' ],
				'wp_query_get_times' => 0,
				'expected'           => 2,
			],
		];
	}

	/**
	 * Tests that get_current_archive_page_number retrieves `page` from the query as integer.
	 *
	 * @covers ::get_current_post_page_number
	 *
	 * @dataProvider data_provider_get_current_post_page_number
	 *
	 * @param string $query_var_paged    The query var paged.
	 * @param array  $get                The get array.
	 * @param int    $wp_query_get_times The number of times to call get on the wp_query get method.
	 * @param int    $expected           The expected page number.
	 *
	 * @return void
	 */
	public function test_get_current_post_page_number( $query_var_paged, $get, $wp_query_get_times, $expected ) {
		$wp_query = Mockery::mock( WP_Query::class );

		$_GET = $get;

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		$wp_query->expects( 'get' )
			->with( 'page' )
			->times( $wp_query_get_times )
			->andReturn( $query_var_paged );

		$this->assertEquals( $expected, $this->instance->get_current_post_page_number() );
	}

	/**
	 * Data provider for the test_get_current_page_number test.
	 *
	 * @return array
	 */
	public static function data_provider_get_current_page_number() {
		return [
			'Query var paged' => [
				'query_var_paged' => 100,
				'get'             => [],
				'expected'        => 100,
			],
			'No query_var paged' => [
				'query_var_paged' => 0,
				'get'             => [],
				'expected'        => 0,
			],
			'No query paged' => [
				'query_var_paged' => '0',
				'get'             => [ 'query-1-page' => '2' ],
				'expected'        => 2,
			],
		];
	}

	/**
	 * Tests the retrieval of the current page number.
	 *
	 * @covers ::get_current_page_number
	 *
	 * @dataProvider data_provider_get_current_page_number
	 *
	 * @param string $query_var_paged The query var paged.
	 * @param array  $get             The get array.
	 * @param int    $expected        The expected page number.
	 *
	 * @return void
	 */
	public function test_get_current_page_number( $query_var_paged, $get, $expected ) {
		Monkey\Functions\expect( 'get_query_var' )
			->with( 'paged', 1 )
			->andReturn( $query_var_paged );

		$_GET = $get;

		$this->assertSame( $expected, $this->instance->get_current_page_number() );
	}

	/**
	 * Tests the retrieval of the current page number.
	 *
	 * @covers ::get_current_page_number
	 *
	 * @return void
	 */
	public function test_get_current_page_number_fallback_to_page() {
		Monkey\Functions\expect( 'get_query_var' )
			->twice()
			->andReturnUsing(
				static function ( $query_var, $default_response ) {
					if ( $query_var === 'page' ) {
						$default_response = 2;
					}

					return $default_response;
				}
			);

		$this->assertSame( 2, $this->instance->get_current_page_number() );
	}

	/**
	 * Mocks the return value of $wp_rewrite->using_permalinks.
	 *
	 * @param bool $using_permalinks Returns value of $wp_rewrite->using_permalinks.
	 *
	 * @return void
	 */
	private function using_permalinks( $using_permalinks ) {
		$wp_rewrite_mock                  = Mockery::mock( WP_Rewrite::class );
		$wp_rewrite_mock->pagination_base = 'page';

		$wp_rewrite_mock
			->expects( 'using_permalinks' )
			->andReturn( $using_permalinks );

		$this->wp_rewrite_wrapper
			->expects( 'get' )
			->andReturn( $wp_rewrite_mock );
	}

	/**
	 * Data provider for the test_get_key_query_loop test.
	 *
	 * @return array
	 */
	public static function data_provider_get_key_query_loop() {
		return [
			'Key with one digit number' => [
				'key'     => 'query-1-page',
				'value'   => '2',
				'expects' => 'query-1-page',
			],
			'Key with two digit number' => [
				'key'     => 'query-15-page',
				'value'   => '2',
				'expects' => 'query-15-page',
			],
			'Key with 0' => [
				'key'     => 'query-0-page',
				'value'   => '2',
				'expects' => 'query-0-page',
			],
			'Key not number' => [
				'key'     => 'query-test-page',
				'value'   => '2',
				'expects' => null,
			],
			'Key is sign' => [
				'key'     => 'query-#-page',
				'value'   => '2',
				'expects' => null,
			],
			'No key' => [
				'key'     => null,
				'value'   => null,
				'expects' => null,
			],
		];
	}

	/**
	 * Tests the retrieval of the key query loop.
	 *
	 * @dataProvider data_provider_get_key_query_loop
	 *
	 * @covers ::get_key_query_loop
	 *
	 * @param string $key     The key to set in the $_GET array.
	 * @param string $value   The value to set in the $_GET array.
	 * @param string $expects The expected key query loop.
	 *
	 * @return void
	 */
	public function test_get_key_query_loop( $key, $value, $expects ) {
		$_GET[ $key ] = $value;

		$this->assertEquals( $expects, $this->instance->get_key_query_loop() );
	}

	/**
	 * Data provider for the test_get_page_number_from_query_loop test.
	 *
	 * @return array
	 */
	public static function data_provider_test_get_page_number_from_query_loop() {
		return [
			'Key with one digit number' => [
				'key'     => 'query-1-page',
				'value'   => '2',
				'expects' => 2,
			],
			'Key with two digit number' => [
				'key'     => 'query-15-page',
				'value'   => '3',
				'expects' => 3,
			],
			'Value 0' => [
				'key'     => 'query-0-page',
				'value'   => '0',
				'expects' => null,
			],
			'Key not number' => [
				'key'     => 'query-test-page',
				'value'   => '5',
				'expects' => null,
			],
			'Value not number' => [
				'key'     => 'query-test-page',
				'value'   => 'hello',
				'expects' => null,
			],
			'Key is sign' => [
				'key'     => 'query-#-page',
				'value'   => '6',
				'expects' => null,
			],
			'No key' => [
				'key'     => null,
				'value'   => null,
				'expects' => null,
			],
		];
	}

	/**
	 * Tests the retrieval of the page number from the query loop.
	 *
	 * @dataProvider data_provider_test_get_page_number_from_query_loop
	 *
	 * @covers ::get_page_number_from_query_loop
	 *
	 * @param string $key     The key to set in the $_GET array.
	 * @param string $value   The value to set in the $_GET array.
	 * @param string $expects The expected page number.
	 *
	 * @return void
	 */
	public function test_get_page_number_from_query_loop( $key, $value, $expects ) {
		$_GET[ $key ] = $value;

		$this->assertEquals( $expects, $this->instance->get_page_number_from_query_loop() );
	}
}

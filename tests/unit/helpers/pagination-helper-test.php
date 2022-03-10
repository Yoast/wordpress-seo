<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
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
class Pagination_Helper_Test extends TestCase {

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
	 */
	protected function set_up() {
		parent::set_up();

		$this->wp_rewrite_wrapper = Mockery::mock( WP_Rewrite_Wrapper::class );
		$this->wp_query_wrapper   = Mockery::mock( WP_Query_Wrapper::class );

		$this->instance = new Pagination_Helper( $this->wp_rewrite_wrapper, $this->wp_query_wrapper );
	}

	/**
	 * Tests if given dependencies are set as expected.
	 *
	 * @covers ::__construct
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
	 */
	public function test_is_disabled_true() {
		Monkey\Filters\expectApplied( 'wpseo_disable_adjacent_rel_links' )
			->with( false )
			->andReturn( true );

		$actual = $this->instance->is_rel_adjacent_disabled();

		$this->assertTrue( $actual );
	}

	/**
	 * Tests that `get_paginated_url` returns the url without a url parameter.
	 *
	 * @covers ::get_paginated_url
	 */
	public function test_get_paginated_url_using_permalinks_without_pagination_base() {
		$this->using_permalinks( true );

		$actual   = $this->instance->get_paginated_url( 'https://example.com/my-post/', 2, false );
		$expected = 'https://example.com/my-post/2/';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that `get_paginated_url` returns the url without a url parameter with a pagination base part.
	 *
	 * @covers ::get_paginated_url
	 */
	public function test_get_paginated_url_using_permalinks_with_pagination_base() {
		$this->using_permalinks( true );

		$actual   = $this->instance->get_paginated_url( 'https://example.com/my-post/', 2, true );
		$expected = 'https://example.com/my-post/page/2/';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that `get_paginated_url` returns the url with a url parameter.
	 *
	 * @covers ::get_paginated_url
	 */
	public function test_get_paginated_url_not_using_permalinks() {
		$this->using_permalinks( false );

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with( 'page', 2, 'https://example.com/my-post/' )
			->andReturn( 'https://example.com/my-post?page=2' );

		$actual   = $this->instance->get_paginated_url( 'https://example.com/my-post/', 2 );
		$expected = 'https://example.com/my-post?page=2';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that `get_paginated_url` returns the url with a url parameter with a custom pagination query name.
	 *
	 * @covers ::get_paginated_url
	 */
	public function test_get_paginated_url_not_using_permalinks_with_custom_pagination_query_name() {
		$this->using_permalinks( false );

		Monkey\Functions\expect( 'add_query_arg' )
			->once()
			->with( 'custom', 2, 'https://example.com/my-post/' )
			->andReturn( 'https://example.com/my-post?custom=2' );

		$actual   = $this->instance->get_paginated_url( 'https://example.com/my-post/', 2, false, 'custom' );
		$expected = 'https://example.com/my-post?custom=2';

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that get_number_of_archive_pages retrieves `max_number_pages` from the query as integer.
	 *
	 * @covers ::get_number_of_archive_pages
	 */
	public function test_get_number_of_archive_pages() {
		$wp_query                = Mockery::mock( 'WP_Query' );
		$wp_query->max_num_pages = '6';

		$this->wp_query_wrapper
			->expects( 'get_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertEquals( 6, $this->instance->get_number_of_archive_pages() );
	}

	/**
	 * Tests that get_current_archive_page_number retrieves `paged` from the query as integer.
	 *
	 * @covers ::get_current_archive_page_number
	 */
	public function test_get_current_archive_page() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->expects( 'get' )->with( 'paged' )->once()->andReturn( '2' );

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertEquals( 2, $this->instance->get_current_archive_page_number() );
	}

	/**
	 * Tests that get_current_archive_page_number retrieves `page` from the query as integer.
	 *
	 * @covers ::get_current_post_page_number
	 */
	public function test_get_current_post_page() {
		$wp_query = Mockery::mock( 'WP_Query' );
		$wp_query->expects( 'get' )->with( 'page' )->once()->andReturn( '2' );

		$this->wp_query_wrapper
			->expects( 'get_main_query' )
			->once()
			->andReturn( $wp_query );

		$this->assertEquals( 2, $this->instance->get_current_post_page_number() );
	}

	/**
	 * Tests the retrieval of the current page number.
	 *
	 * @covers ::get_current_page_number
	 */
	public function test_get_current_page_number() {
		Monkey\Functions\expect( 'get_query_var' )
			->with( 'paged', 1 )
			->andReturn( 100 );

		$this->assertSame( 100, $this->instance->get_current_page_number() );
	}

	/**
	 * Tests the retrieval of the current page number.
	 *
	 * @covers ::get_current_page_number
	 */
	public function test_get_current_page_number_fallback_to_page() {
		Monkey\Functions\expect( 'get_query_var' )
			->twice()
			->andReturnUsing(
				static function( $query_var, $default_response ) {
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
	 */
	private function using_permalinks( $using_permalinks ) {
		$wp_rewrite_mock                  = Mockery::mock( 'WP_Rewrite' );
		$wp_rewrite_mock->pagination_base = 'page';

		$wp_rewrite_mock
			->expects( 'using_permalinks' )
			->andReturn( $using_permalinks );

		$this->wp_rewrite_wrapper
			->expects( 'get' )
			->andReturn( $wp_rewrite_mock );
	}
}

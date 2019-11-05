<?php

namespace Yoast\WP\Free\Tests\Helpers;

use Mockery;
use Brain\Monkey;
use Yoast\WP\Free\Helpers\Pagination_Helper;
use Yoast\WP\Free\Tests\TestCase;
use Yoast\WP\Free\Wrappers\WP_Rewrite_Wrapper;

/**
 * Class Pagination_Helper_Test.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\Free\Helpers\Pagination_Helper
 */
class Pagination_Helper_Test extends TestCase {

	/**
	 * @var Pagination_Helper
	 */
	private $instance;

	/**
	 * @var WP_Rewrite_Wrapper|Mockery\MockInterface
	 */
	private $wp_rewrite_wrapper;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->wp_rewrite_wrapper = Mockery::mock( WP_Rewrite_Wrapper::class );

		$this->instance = new Pagination_Helper( $this->wp_rewrite_wrapper );
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

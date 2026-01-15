<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Cache;

use Brain\Monkey;
use Exception;
use Generator;

/**
 * Tests the Cache Manager get method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::get
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::get_cache_key
 */
final class Get_Test extends Abstract_Manager_Test {

	/**
	 * Tests get() returns null when cache is disabled.
	 *
	 * @return void
	 */
	public function test_get_returns_null_when_cache_disabled() {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( false );

		$result = $this->instance->get( 'post', 1, 10 );

		$this->assertNull( $result );
	}

	/**
	 * Tests get() returns null with invalid page number.
	 *
	 * @param int $page     The page number to test.
	 * @param int $per_page The per_page number to test.
	 *
	 * @dataProvider invalid_page_per_page_provider
	 *
	 * @return void
	 */
	public function test_get_returns_null_with_invalid_parameters( $page, $per_page ) {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( true );

		$result = $this->instance->get( 'post', $page, $per_page );

		$this->assertNull( $result );
	}

	/**
	 * Data provider for invalid page and per_page values.
	 *
	 * @return Generator
	 */
	public static function invalid_page_per_page_provider() {
		yield 'Zero page' => [
			'page'     => 0,
			'per_page' => 10,
		];
		yield 'Negative page' => [
			'page'     => -1,
			'per_page' => 10,
		];
		yield 'Zero per_page' => [
			'page'     => 1,
			'per_page' => 0,
		];
		yield 'Negative per_page' => [
			'page'     => 1,
			'per_page' => -5,
		];
	}

	/**
	 * Tests get() returns null when transient returns false (cache miss).
	 *
	 * @return void
	 */
	public function test_get_returns_null_on_cache_miss() {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( true );

		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( 'yoast_schema_aggregator_page_1_per_10_type_post_v1' )
			->andReturn( false );

		$result = $this->instance->get( 'post', 1, 10 );

		$this->assertNull( $result );
	}

	/**
	 * Tests get() returns null and deletes transient when data is not an array.
	 *
	 * @return void
	 */
	public function test_get_returns_null_and_deletes_corrupted_cache() {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( true );

		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( 'yoast_schema_aggregator_page_1_per_10_type_post_v1' )
			->andReturn( 'invalid_data' );

		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( 'yoast_schema_aggregator_page_1_per_10_type_post_v1' )
			->andReturn( true );

		$result = $this->instance->get( 'post', 1, 10 );

		$this->assertNull( $result );
	}

	/**
	 * Tests get() returns cached data successfully.
	 *
	 * @return void
	 */
	public function test_get_returns_cached_data() {
		$cached_data = [ 'item1', 'item2', 'item3' ];

		$this->config->expects( 'cache_enabled' )->once()->andReturn( true );

		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( 'yoast_schema_aggregator_page_1_per_10_type_post_v1' )
			->andReturn( $cached_data );

		$result = $this->instance->get( 'post', 1, 10 );

		$this->assertSame( $cached_data, $result );
	}

	/**
	 * Tests get() returns cached data with various page/per_page combinations.
	 *
	 * @param int           $page         The page number.
	 * @param int           $per_page     The items per page.
	 * @param string        $expected_key The expected cache key.
	 * @param array<string> $cached_data  The cached data to return.
	 *
	 * @dataProvider get_cache_data_provider
	 *
	 * @return void
	 */
	public function test_get_with_various_parameters( $page, $per_page, $expected_key, $cached_data ) {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( true );

		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( $expected_key )
			->andReturn( $cached_data );

		$result = $this->instance->get( 'post', $page, $per_page );

		$this->assertSame( $cached_data, $result );
	}

	/**
	 * Data provider for get() with various parameters.
	 *
	 * @return Generator
	 */
	public static function get_cache_data_provider() {
		yield 'First page, 10 items' => [
			'page'         => 1,
			'per_page'     => 10,
			'expected_key' => 'yoast_schema_aggregator_page_1_per_10_type_post_v1',
			'cached_data'  => [ 'data1' ],
		];
		yield 'Second page, 20 items' => [
			'page'         => 2,
			'per_page'     => 20,
			'expected_key' => 'yoast_schema_aggregator_page_2_per_20_type_post_v1',
			'cached_data'  => [ 'data2', 'data3' ],
		];
		yield 'Large page number' => [
			'page'         => 100,
			'per_page'     => 50,
			'expected_key' => 'yoast_schema_aggregator_page_100_per_50_type_post_v1',
			'cached_data'  => [ 'data100' ],
		];
	}

	/**
	 * Tests get() handles exceptions gracefully and returns null.
	 *
	 * @return void
	 */
	public function test_get_handles_exceptions_gracefully() {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( true );

		Monkey\Functions\expect( 'get_transient' )
			->once()
			->with( 'yoast_schema_aggregator_page_1_per_10_type_post_v1' )
			->andThrow( new Exception( 'Simulated exception' ) );

		$result = $this->instance->get( 'post', 1, 10 );

		$this->assertNull( $result );
	}
}

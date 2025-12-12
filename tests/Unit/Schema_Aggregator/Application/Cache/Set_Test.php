<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Cache;

use Brain\Monkey;
use Generator;

/**
 * Tests the Cache Manager set method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::set
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::get_cache_key
 */
final class Set_Test extends Abstract_Manager_Test {

	/**
	 * Tests set() returns false with invalid parameters.
	 *
	 * @param int           $page     The page number.
	 * @param int           $per_page The items per page.
	 * @param array<string> $data     The data to cache.
	 *
	 * @dataProvider invalid_set_parameters_provider
	 *
	 * @return void
	 */
	public function test_set_returns_false_with_invalid_parameters( $page, $per_page, $data ) {
		$result = $this->instance->set( $page, $per_page, $data );

		$this->assertFalse( $result );
	}

	/**
	 * Data provider for invalid set() parameters.
	 *
	 * @return Generator
	 */
	public static function invalid_set_parameters_provider() {
		yield 'Zero page' => [
			'page'     => 0,
			'per_page' => 10,
			'data'     => [ 'test' ],
		];
		yield 'Negative page' => [
			'page'     => -1,
			'per_page' => 10,
			'data'     => [ 'test' ],
		];
		yield 'Zero per_page' => [
			'page'     => 1,
			'per_page' => 0,
			'data'     => [ 'test' ],
		];
		yield 'Negative per_page' => [
			'page'     => 1,
			'per_page' => -5,
			'data'     => [ 'test' ],
		];
	}

	/**
	 * Tests set() caches data successfully.
	 *
	 * @return void
	 */
	public function test_set_caches_data_successfully() {
		$data       = [ 'item1', 'item2' ];
		$expiration = 3600;

		$this->config->expects( 'get_expiration' )
			->once()
			->with( $data )
			->andReturn( $expiration );

		Monkey\Functions\expect( 'set_transient' )
			->once()
			->with( 'yoast_schema_aggregator_page_1_per_10_v1', $data, $expiration )
			->andReturn( true );

		$result = $this->instance->set( 1, 10, $data );

		$this->assertTrue( $result );
	}

	/**
	 * Tests set() with various data and parameters.
	 *
	 * @param int           $page         The page number.
	 * @param int           $per_page     The items per page.
	 * @param array<string> $data         The data to cache.
	 * @param int           $expiration   The expiration time.
	 * @param string        $expected_key The expected cache key.
	 *
	 * @dataProvider set_cache_data_provider
	 *
	 * @return void
	 */
	public function test_set_with_various_parameters( $page, $per_page, $data, $expiration, $expected_key ) {
		$this->config->expects( 'get_expiration' )
			->once()
			->with( $data )
			->andReturn( $expiration );

		Monkey\Functions\expect( 'set_transient' )
			->once()
			->with( $expected_key, $data, $expiration )
			->andReturn( true );

		$result = $this->instance->set( $page, $per_page, $data );

		$this->assertTrue( $result );
	}

	/**
	 * Data provider for set() with various parameters.
	 *
	 * @return Generator
	 */
	public static function set_cache_data_provider() {
		yield 'Small data, short expiration' => [
			'page'         => 1,
			'per_page'     => 10,
			'data'         => [ 'small' ],
			'expiration'   => 1800,
			'expected_key' => 'yoast_schema_aggregator_page_1_per_10_v1',
		];
		yield 'Large data, long expiration' => [
			'page'         => 2,
			'per_page'     => 50,
			'data'         => \array_fill( 0, 100, 'large_data' ),
			'expiration'   => 21600,
			'expected_key' => 'yoast_schema_aggregator_page_2_per_50_v1',
		];
	}
}

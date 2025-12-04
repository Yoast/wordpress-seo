<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Cache;

use Brain\Monkey;
use Generator;
use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Config;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Cache Manager.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::__construct
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::get
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::set
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::invalidate
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::invalidate_all
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::get_cache_key
 */
final class Manager_Test extends TestCase {

	/**
	 * The Config mock.
	 *
	 * @var Mockery\MockInterface|Config
	 */
	protected $config;

	/**
	 * The instance under test.
	 *
	 * @var Manager
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->config   = Mockery::mock( Config::class );
		$this->instance = new Manager( $this->config );
	}

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Config::class,
			$this->getPropertyValue( $this->instance, 'config' )
		);
	}

	/**
	 * Tests get() returns null when cache is disabled.
	 *
	 * @return void
	 */
	public function test_get_returns_null_when_cache_disabled() {
		$this->config->expects( 'cache_enabled' )->once()->andReturn( false );

		$result = $this->instance->get( 1, 10 );

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

		$result = $this->instance->get( $page, $per_page );

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
			->with( 'yoast_schema_aggregator_page_1_per_10_v1' )
			->andReturn( false );

		$result = $this->instance->get( 1, 10 );

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
			->with( 'yoast_schema_aggregator_page_1_per_10_v1' )
			->andReturn( 'invalid_data' );

		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( 'yoast_schema_aggregator_page_1_per_10_v1' )
			->andReturn( true );

		$result = $this->instance->get( 1, 10 );

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
			->with( 'yoast_schema_aggregator_page_1_per_10_v1' )
			->andReturn( $cached_data );

		$result = $this->instance->get( 1, 10 );

		$this->assertSame( $cached_data, $result );
	}

	/**
	 * Tests get() returns cached data with various page/per_page combinations.
	 *
	 * @param int           $page        The page number.
	 * @param int           $per_page    The items per page.
	 * @param string        $expected_key The expected cache key.
	 * @param array<string> $cached_data The cached data to return.
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

		$result = $this->instance->get( $page, $per_page );

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
			'expected_key' => 'yoast_schema_aggregator_page_1_per_10_v1',
			'cached_data'  => [ 'data1' ],
		];
		yield 'Second page, 20 items' => [
			'page'         => 2,
			'per_page'     => 20,
			'expected_key' => 'yoast_schema_aggregator_page_2_per_20_v1',
			'cached_data'  => [ 'data2', 'data3' ],
		];
		yield 'Large page number' => [
			'page'         => 100,
			'per_page'     => 50,
			'expected_key' => 'yoast_schema_aggregator_page_100_per_50_v1',
			'cached_data'  => [ 'data100' ],
		];
	}

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
	 * @param int           $page        The page number.
	 * @param int           $per_page    The items per page.
	 * @param array<string> $data        The data to cache.
	 * @param int           $expiration  The expiration time.
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

	/**
	 * Tests invalidate() deletes specific cache entry.
	 *
	 * @return void
	 */
	public function test_invalidate_deletes_specific_entry() {
		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( 'yoast_schema_aggregator_page_1_per_10_v1' )
			->andReturn( true );

		$result = $this->instance->invalidate( 1, 10 );

		$this->assertTrue( $result );
	}

	/**
	 * Tests invalidate() with only page parameter clears all per_page variations.
	 *
	 * @return void
	 */
	public function test_invalidate_clears_all_per_page_variations_for_page() {
		global $wpdb;
		$wpdb = Mockery::mock( 'wpdb' );
		$wpdb->options = 'wp_options';

		$wpdb->expects( 'prepare' )
			->once()
			->with(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
				'_transient_yoast_schema_aggregator_page_1_per_%',
				'_transient_timeout_yoast_schema_aggregator_page_1_per_%'
			)
			->andReturn( 'PREPARED_QUERY' );

		$wpdb->expects( 'query' )
			->once()
			->with( 'PREPARED_QUERY' )
			->andReturn( 5 );

		$result = $this->instance->invalidate( 1, null );

		$this->assertTrue( $result );
	}

	/**
	 * Tests invalidate() returns false when wpdb is not available.
	 *
	 * @return void
	 */
	public function test_invalidate_returns_false_when_wpdb_not_available() {
		global $wpdb;
		$wpdb = null;

		$result = $this->instance->invalidate( 1, null );

		$this->assertFalse( $result );
	}

	/**
	 * Tests invalidate() with no parameters calls invalidate_all().
	 *
	 * @return void
	 */
	public function test_invalidate_with_no_parameters_calls_invalidate_all() {
		global $wpdb;
		$wpdb = Mockery::mock( 'wpdb' );
		$wpdb->options = 'wp_options';

		$wpdb->expects( 'prepare' )
			->once()
			->andReturn( 'PREPARED_QUERY' );

		$wpdb->expects( 'query' )
			->once()
			->with( 'PREPARED_QUERY' )
			->andReturn( 10 );

		$result = $this->instance->invalidate( null, null );

		$this->assertTrue( $result );
	}

	/**
	 * Tests invalidate_all() deletes all cache entries.
	 *
	 * @return void
	 */
	public function test_invalidate_all_deletes_all_entries() {
		global $wpdb;
		$wpdb = Mockery::mock( 'wpdb' );
		$wpdb->options = 'wp_options';

		$wpdb->expects( 'prepare' )
			->once()
			->with(
				"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
				'_transient_yoast_schema_aggregator_page_%',
				'_transient_timeout_yoast_schema_aggregator_page_%'
			)
			->andReturn( 'PREPARED_QUERY' );

		$wpdb->expects( 'query' )
			->once()
			->with( 'PREPARED_QUERY' )
			->andReturn( 20 );

		$result = $this->instance->invalidate_all();

		$this->assertTrue( $result );
	}

	/**
	 * Tests invalidate_all() returns false when wpdb is not available.
	 *
	 * @return void
	 */
	public function test_invalidate_all_returns_false_when_wpdb_not_available() {
		global $wpdb;
		$wpdb = null;

		$result = $this->instance->invalidate_all();

		$this->assertFalse( $result );
	}

	/**
	 * Tests invalidate_all() returns false when query fails.
	 *
	 * @return void
	 */
	public function test_invalidate_all_returns_false_when_query_fails() {
		global $wpdb;
		$wpdb = Mockery::mock( 'wpdb' );
		$wpdb->options = 'wp_options';

		$wpdb->expects( 'prepare' )
			->once()
			->andReturn( 'PREPARED_QUERY' );

		$wpdb->expects( 'query' )
			->once()
			->with( 'PREPARED_QUERY' )
			->andReturn( false );

		$result = $this->instance->invalidate_all();

		$this->assertFalse( $result );
	}
}

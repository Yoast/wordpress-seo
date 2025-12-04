<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Cache;

use Brain\Monkey;
use Mockery;

/**
 * Tests the Cache Manager invalidate method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::invalidate
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::get_cache_key
 */
final class Invalidate_Test extends Abstract_Manager_Test {

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
		$wpdb          = Mockery::mock( 'wpdb' );
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
		$wpdb          = Mockery::mock( 'wpdb' );
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
}

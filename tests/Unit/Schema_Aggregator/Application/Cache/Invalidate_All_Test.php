<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Cache;

use Exception;
use Mockery;

/**
 * Tests the Cache Manager invalidate_all method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Manager::invalidate_all
 */
final class Invalidate_All_Test extends Abstract_Manager_Test {

	/**
	 * Tests invalidate_all() deletes all cache entries.
	 *
	 * @return void
	 */
	public function test_invalidate_all_deletes_all_entries() {
		global $wpdb;
		$wpdb          = Mockery::mock( 'wpdb' );
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
		$wpdb          = Mockery::mock( 'wpdb' );
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

	/**
	 * Tests invalidate_all() handles exceptions gracefully.
	 *
	 * @return void
	 */
	public function test_invalidate_all_handles_exception_gracefully() {
		global $wpdb;
		$wpdb          = Mockery::mock( 'wpdb' );
		$wpdb->options = 'wp_options';

		$wpdb->expects( 'prepare' )
			->once()
			->andReturn( 'PREPARED_QUERY' );

		$wpdb->expects( 'query' )
			->once()
			->with( 'PREPARED_QUERY' )
			->andThrow( new Exception( 'Database error' ) );

		$result = $this->instance->invalidate_all();

		$this->assertFalse( $result );
	}
}

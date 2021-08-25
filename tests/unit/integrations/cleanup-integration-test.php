<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\Lib\Model;

/**
 * Class Cleanup_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Cleanup_Integration
 *
 * @group integrations
 */
class Cleanup_Integration_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Mockery\MockInterface|Cleanup_Integration
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = Mockery::mock( Cleanup_Integration::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Actions\has( 'wpseo_cleanup_cron', [ $this->instance, 'run_cleanup_cron' ] ), 'Does not have expected run_cleanup_cron filter' );
		$this->assertNotFalse( Monkey\Actions\has( 'wpseo_deactivate', [ $this->instance, 'reset_cleanup' ] ), 'Does not have expected reset_cleanup filter' );
	}

	/**
	 * Tests calling test_run_cleanup.
	 *
	 * @covers ::test_run_cleanup
	 */
	public function test_run_cleanup() {
		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( 'wpseo_cleanup_cron' );

		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( 1000 );

		global $wpdb;

		$wpdb         = Mockery::mock( 'wpdb' );
		$wpdb->prefix = 'wp_';

		/* Clean up of indexables with object_sub_type shop-order */
		$wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable WHERE object_type = %s AND object_sub_type = %s ORDER BY id LIMIT %d',
				'post',
				'shop-order',
				1000
			)
			->andReturn( 'prepared_shop_order_delete_query' );

		$wpdb->shouldReceive( 'query' )
			->once()
			->with( 'prepared_shop_order_delete_query' )
			->andReturn( 50 );

		/* Clean up of indexables with post_status auto-draft */
		$wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable WHERE post_status = %s ORDER BY id LIMIT %d',
				'auto-draft',
				1000
			)
			->andReturn( 'prepared_auto_draft_delete_query' );

		$wpdb->shouldReceive( 'query' )
			->once()
			->with( 'prepared_auto_draft_delete_query' )
			->andReturn( 50 );

		/* Clean up of indexable hierarchy for deleted indexables */
		$wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'
			SELECT table_to_clean.indexable_id
			FROM wp_yoast_indexable_hierarchy table_to_clean
			LEFT JOIN wp_yoast_indexable AS indexable_table
			ON table_to_clean.indexable_id = indexable_table.id
			WHERE indexable_table.id IS NULL
			AND table_to_clean.indexable_id IS NOT NULL
			LIMIT %d',
				1000
			)
			->andReturn( 'prepared_indexable_hierarchy_select_query' );

		$wpdb->shouldReceive( 'get_col' )
			->once()
			->with( 'prepared_indexable_hierarchy_select_query' )
			->andReturn( [ 1, 2, 3 ] );

		$wpdb->shouldReceive( 'query' )
			->once()
			->with( 'DELETE FROM wp_yoast_indexable_hierarchy WHERE indexable_id IN( 1,2,3 )' )
			->andReturn( 50 );

		/* Clean up of seo links ids for deleted indexables */
		$wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'
			SELECT table_to_clean.indexable_id
			FROM wp_yoast_seo_links table_to_clean
			LEFT JOIN wp_yoast_indexable AS indexable_table
			ON table_to_clean.indexable_id = indexable_table.id
			WHERE indexable_table.id IS NULL
			AND table_to_clean.indexable_id IS NOT NULL
			LIMIT %d',
				1000
			)
			->andReturn( 'wp_yoast_seo_links_indexable_id_select_query' );

		$wpdb->shouldReceive( 'get_col' )
			->once()
			->with( 'wp_yoast_seo_links_indexable_id_select_query' )
			->andReturn( [ 4, 5, 6 ] );

		$wpdb->shouldReceive( 'query' )
			->once()
			->with( 'DELETE FROM wp_yoast_seo_links WHERE indexable_id IN( 4,5,6 )' )
			->andReturn( 50 );

		/* Clean up of seo links target ids for deleted indexables */
		$wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'
			SELECT table_to_clean.target_indexable_id
			FROM wp_yoast_seo_links table_to_clean
			LEFT JOIN wp_yoast_indexable AS indexable_table
			ON table_to_clean.target_indexable_id = indexable_table.id
			WHERE indexable_table.id IS NULL
			AND table_to_clean.target_indexable_id IS NOT NULL
			LIMIT %d',
				1000
			)
			->andReturn( 'wp_yoast_seo_links_target_indexable_id_select_query' );

		$wpdb->shouldReceive( 'get_col' )
			->once()
			->with( 'wp_yoast_seo_links_target_indexable_id_select_query' )
			->andReturn( [ 7, 8, 9 ] );

		$wpdb->shouldReceive( 'query' )
			->once()
			->with( 'DELETE FROM wp_yoast_seo_links WHERE target_indexable_id IN( 7,8,9 )' )
			->andReturn( 50 );

		$this->instance->run_cleanup();
	}
}

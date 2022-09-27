<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use wpdb;
use Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Cleanup_Action;
use Yoast\WP\SEO\Helpers\Aioseo_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_Cleanup_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Aioseo\Aioseo_Cleanup_Action
 */
class Aioseo_Cleanup_Action_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var Aioseo_Cleanup_Action
	 */
	protected $instance;

	/**
	 * The mocked WordPress database object.
	 *
	 * @var Mockery\MockInterface|wpdb
	 */
	protected $wpdb;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * The AIOSEO helper.
	 *
	 * @var Mockery\MockInterface|Aioseo_Helper
	 */
	protected $aioseo_helper;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->wpdb          = Mockery::mock( 'wpdb' );
		$this->options       = Mockery::mock( Options_Helper::class );
		$this->aioseo_helper = Mockery::mock( Aioseo_Helper::class );

		$this->instance = new Aioseo_Cleanup_Action( $this->wpdb, $this->options );

		$this->instance->set_aioseo_helper( $this->aioseo_helper );

		$this->wpdb->prefix = 'wp_';
	}

	/**
	 * Tests the checking if the cleanup has been completed in the past.
	 *
	 * @dataProvider provider_get_unindexed
	 * @covers ::get_total_unindexed
	 *
	 * @param bool  $table_exists        Whether the AIOSEO table exists.
	 * @param array $completed_option    The persistent completed option.
	 * @param int   $get_completed_times The times we're gonna get the persistent completed option.
	 * @param int   $expected_result     The expected result.
	 */
	public function test_get_total_unindexed( $table_exists, $completed_option, $get_completed_times, $expected_result ) {
		$this->aioseo_helper->expects( 'aioseo_exists' )
			->andReturn( $table_exists );

		$this->options->expects( 'get' )
			->times( $get_completed_times )
			->with( 'importing_completed', [] )
			->andReturn( $completed_option );

		$unindexed = $this->instance->get_total_unindexed();
		$this->assertSame( $expected_result, $unindexed );
	}

	/**
	 * Tests the checking if the cleanup has been completed in the past.
	 *
	 * @dataProvider provider_get_unindexed
	 * @covers ::get_limited_unindexed_count
	 *
	 * @param bool  $table_exists        Whether the AIOSEO table exists.
	 * @param array $completed_option    The persistent completed option.
	 * @param int   $get_completed_times The times we're gonna get the persistent completed option.
	 * @param int   $expected_result     The expected result.
	 */
	public function test_get_limited_unindexed_count( $table_exists, $completed_option, $get_completed_times, $expected_result ) {
		$this->aioseo_helper->expects( 'aioseo_exists' )
			->andReturn( $table_exists );

		$this->options->expects( 'get' )
			->times( $get_completed_times )
			->with( 'importing_completed', [] )
			->andReturn( $completed_option );

		$unindexed = $this->instance->get_limited_unindexed_count( 1 );
		$this->assertSame( $expected_result, $unindexed );
	}

	/**
	 * Tests the checking if the cleanup has been completed in the past.
	 *
	 * @dataProvider provider_index
	 * @covers ::index
	 * @covers ::cleanup_postmeta_query
	 * @covers ::truncate_query
	 * @covers ::get_postmeta_table
	 * @covers ::get_aioseo_table
	 *
	 * @param array     $completed_option   The persistent completed option.
	 * @param int       $query_times        The times we're gonna run the cleanup queries.
	 * @param int       $set_complete_times The times we're gonna set the persistent completed option.
	 * @param int|false $postmeta_cleanup   The result of the postmeta cleanup query.
	 * @param bool      $truncate_cleanup   The result of the truncate query.
	 * @param array     $expected_result    The expected result.
	 */
	public function test_index( $completed_option, $query_times, $set_complete_times, $postmeta_cleanup, $truncate_cleanup, $expected_result ) {
		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( $completed_option );

		$expected_postmeta_query = 'DELETE FROM wp_postmeta WHERE meta_key IN (%s, %s, %s, %s, %s, %s)';
		$this->wpdb->expects( 'prepare' )
			->times( $query_times )
			->with(
				$expected_postmeta_query,
				[
					'_aioseo_title',
					'_aioseo_description',
					'_aioseo_og_title',
					'_aioseo_og_description',
					'_aioseo_twitter_title',
					'_aioseo_twitter_description',
				]
			)
			->andReturn(
				"
				DELETE FROM wp_postmeta
				WHERE meta_key IN ('_aioseo_title','_aioseo_description','_aioseo_og_title','_aioseo_og_description','_aioseo_twitter_title','_aioseo_twitter_description')"
			);

		$this->wpdb->expects( 'query' )
			->times( $query_times )
			->with(
				"
				DELETE FROM wp_postmeta
				WHERE meta_key IN ('_aioseo_title','_aioseo_description','_aioseo_og_title','_aioseo_og_description','_aioseo_twitter_title','_aioseo_twitter_description')"
			)
			->andReturn(
				$postmeta_cleanup
			);

		$this->aioseo_helper->expects( 'aioseo_exists' )
			->times( $query_times )
			->andReturn( true );

		$this->aioseo_helper->expects( 'get_table' )
			->times( $query_times )
			->andReturn( 'wp_aioseo_posts' );

		$expected_truncate_query = 'TRUNCATE TABLE wp_aioseo_posts';
		$this->wpdb->expects( 'query' )
			->times( $query_times )
			->with( $expected_truncate_query )
			->andReturn(
				$truncate_cleanup
			);

		$this->options->expects( 'get' )
			->times( $set_complete_times )
			->with( 'importing_completed', [] )
			->andReturn( [] );
		$this->options->expects( 'set' )
			->times( $set_complete_times )
			->with( 'importing_completed', [ 'aioseo_cleanup' => true ] );

		$cleanup_result = $this->instance->index();
		$this->assertSame( $expected_result, $cleanup_result );
	}

	/**
	 * Data provider for test_index().
	 *
	 * @return array
	 */
	public function provider_index() {
		$successful_result = [
			'metadata_cleanup'   => 10,
			'indexables_cleanup' => true,
		];
		return [
			[ [ 'aioseo_cleanup' => true ], 0, 0, 'irrelevant', 'irrelevant', [] ],
			[ [], 1, 1, 10, true, $successful_result ],
			[ [], 1, 0, false, false, false ],
		];
	}

	/**
	 * Data provider for test_get_total_unindexed() and test_get_limited_unindexed_count().
	 *
	 * @return array
	 */
	public function provider_get_unindexed() {
		$completed                 = [
			'aioseo_cleanup' => true,
		];
		$not_completed             = [
			'aioseo_cleanup' => false,
		];
		$not_completed_with_no_key = [];

		return [
			[ false, [ 'irrelevant' ], 0, 0 ],
			[ true, $completed, 1, 0 ],
			[ true, $not_completed, 1, 1 ],
			[ true, $not_completed_with_no_key, 1, 1 ],
		];
	}
}

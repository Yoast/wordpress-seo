<?php

namespace Yoast\WP\SEO\Tests\Actions\Indexation;

use Brain\Monkey\Functions;
use Brain\Monkey\Filters;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Indexable_Term_Indexation_Action_Test class
 *
 * @group actions
 * @group indexation
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action
 */
class Indexable_Term_Indexation_Action_Test extends TestCase {

	/**
	 * The post type helper mock.
	 *
	 * @var Taxonomy_Helper|Mockery\MockInterface
	 */
	protected $taxonomy;

	/**
	 * The builder mock.
	 *
	 * @var Indexable_Repository|Mockery\MockInterface
	 */
	protected $repository;

	/**
	 * The wpdb mock.
	 *
	 * @var wpdb|Mockery\MockInterface
	 */
	protected $wpdb;

	/**
	 * The instance.
	 *
	 * @var Indexable_Term_Indexation_Action
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		global $wpdb;
		$wpdb = (object) [ 'prefix' => 'wp_' ];

		$this->taxonomy            = Mockery::mock( Taxonomy_Helper::class );
		$this->repository          = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                = Mockery::mock( 'wpdb' );
		$this->wpdb->term_taxonomy = 'wp_term_taxonomy';

		$this->instance = new Indexable_Term_Indexation_Action(
			$this->taxonomy,
			$this->repository,
			$this->wpdb
		);
	}

	/**
	 * Tests the get total unindexed method.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::get_query
	 */
	public function test_get_total_unindexed() {
		$limit_placeholder = '';
		$expected_query    = "
			SELECT COUNT(term_id)
			FROM wp_term_taxonomy
			WHERE term_id NOT IN (
				SELECT object_id
				FROM wp_yoast_indexable
				WHERE object_type = 'term'
			)
			AND taxonomy IN (%s)
			$limit_placeholder";

		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_terms' )->andReturnFalse();
		Functions\expect( 'set_transient' )->once()->with( 'wpseo_total_unindexed_terms', '10', \DAY_IN_SECONDS )->andReturnTrue();
		$this->taxonomy->expects( 'get_public_taxonomies' )->once()->andReturn( [ 'public_taxonomy' ] );
		$this->wpdb->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'public_taxonomy' ] )
			->andReturn( 'query' );
		$this->wpdb->expects( 'get_var' )->once()->with( 'query' )->andReturn( '10' );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the get total unindexed method with cache.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::get_query
	 */
	public function test_get_total_unindexed_cached() {
		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_terms' )->andReturn( '10' );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the get total unindexed method when the query fails.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed_failed_query() {
		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_terms' )->andReturnFalse();

		$this->taxonomy->expects( 'get_public_taxonomies' )->once()->andReturn( [ 'public_taxonomy' ] );
		$this->wpdb->expects( 'prepare' )->once()->andReturn( 'query' );
		$this->wpdb->expects( 'get_var' )->once()->with( 'query' )->andReturn( null );

		$this->assertFalse( $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the index method.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 * @covers ::get_limit
	 * @covers ::get_query
	 */
	public function test_index() {
		$expected_query = '
			SELECT term_id
			FROM wp_term_taxonomy
			WHERE term_id NOT IN (
				SELECT object_id
				FROM wp_yoast_indexable
				WHERE object_type = \'term\'
			)
			AND taxonomy IN (%s)
			LIMIT %d';

		Filters\expectApplied( 'wpseo_term_indexation_limit' )->andReturn( 25 );

		$this->taxonomy->expects( 'get_public_taxonomies' )->once()->andReturn( [ 'public_taxonomy' ] );
		$this->wpdb->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'public_taxonomy', 25 ] )
			->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( [ '1', '3', '8' ] );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'term' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'term' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'term' );

		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_terms' );

		$this->instance->index();
	}

	/**
	 * Tests the filter fallback when not returning an integer.
	 *
	 * @covers ::index
	 * @covers ::get_limit
	 */
	public function test_index_with_limit_filter_no_int() {
		Filters\expectApplied( 'wpseo_term_indexation_limit' )->andReturn( 'not an integer' );

		$this->taxonomy->expects( 'get_public_taxonomies' )->once()->andReturn( [ 'public_taxonomy' ] );
		$this->wpdb->expects( 'prepare' )->once()->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( [ '1', '3', '8' ] );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'term' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'term' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'term' );

		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_terms' );

		$this->instance->index();
	}
}

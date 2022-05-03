<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Indexable_Term_Indexation_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
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
	 * The Versions.
	 *
	 * @var Indexable_Builder_Versions|Mockery\MockInterface
	 */
	protected $versions;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		global $wpdb;
		$wpdb = (object) [ 'prefix' => 'wp_' ];

		$this->taxonomy            = Mockery::mock( Taxonomy_Helper::class );
		$this->repository          = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                = Mockery::mock( 'wpdb' );
		$this->wpdb->term_taxonomy = 'wp_term_taxonomy';
		$this->versions            = Mockery::mock( Indexable_Builder_Versions::class );

		$this->versions
			->expects( 'get_latest_version_for_type' )
			->withArgs( [ 'term' ] )
			->andReturn( 2 );

		$this->instance = new Indexable_Term_Indexation_Action(
			$this->taxonomy,
			$this->repository,
			$this->wpdb,
			$this->versions
		);
	}

	/**
	 * Tests the get total unindexed method.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
	 * @covers ::get_count_query
	 */
	public function test_get_total_unindexed() {
		$expected_query = "
			SELECT COUNT(term_id)
			FROM wp_term_taxonomy AS T
			LEFT JOIN wp_yoast_indexable AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.version = %d
			WHERE I.object_id IS NULL
				AND taxonomy IN (%s, %s)";

		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_terms' )->andReturnFalse();
		Functions\expect( 'set_transient' )->once()->with( 'wpseo_total_unindexed_terms', '10', \DAY_IN_SECONDS )->andReturnTrue();
		$this->taxonomy->expects( 'get_public_taxonomies' )->once()->andReturn(
			[
				'public_taxonomy' => 'public_taxonomy',
				'other_taxonomy'  => 'other_taxonomy',
			]
		);
		$this->wpdb->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 2, 'public_taxonomy', 'other_taxonomy' ] )
			->andReturn( 'query' );
		$this->wpdb->expects( 'get_var' )->once()->with( 'query' )->andReturn( '10' );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the get get_limited_unindexed_count with a limit.
	 *
	 * @covers ::__construct
	 * @covers ::get_limited_unindexed_count
	 * @covers ::get_select_query
	 */
	public function test_get_limited_unindexed_count() {
		$limit          = 10;
		$expected_query = "
			SELECT term_id
			FROM wp_term_taxonomy AS T
			LEFT JOIN wp_yoast_indexable AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.version = %d
			WHERE I.object_id IS NULL
				AND taxonomy IN (%s, %s)
			LIMIT %d";

		$query_result = [
			'term_id_1',
			'term_id_2',
			'term_id_3',
		];

		Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_terms_limited' )->andReturnFalse();
		Functions\expect( 'set_transient' )->once()->with( 'wpseo_total_unindexed_terms_limited', \count( $query_result ), ( \MINUTE_IN_SECONDS * 15 ) )->andReturnTrue();
		$this->taxonomy->expects( 'get_public_taxonomies' )->once()->andReturn(
			[
				'public_taxonomy' => 'public_taxonomy',
				'other_taxonomy'  => 'other_taxonomy',
			]
		);
		$this->wpdb->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 2, 'public_taxonomy', 'other_taxonomy', $limit ] )
			->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( $query_result );

		$this->assertEquals( \count( $query_result ), $this->instance->get_limited_unindexed_count( $limit ) );
	}

	/**
	 * Tests the get total unindexed method with cache.
	 *
	 * @covers ::__construct
	 * @covers ::get_total_unindexed
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
		Functions\expect( 'get_transient' )
			->once()
			->with( 'wpseo_total_unindexed_terms' )
			->andReturnFalse();

		Functions\expect( 'set_transient' )
			->once()
			->with( 'wpseo_total_unindexed_terms', 0, ( \MINUTE_IN_SECONDS * 15 ) )
			->andReturn( true );

		$this->taxonomy
			->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( [ 'public_taxonomy' => 'public_taxonomy' ] );

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->andReturn( 'query' );
		$this->wpdb
			->expects( 'get_var' )
			->once()
			->with( 'query' )
			->andReturn( null );

		$this->assertFalse( $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the index method.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 * @covers ::get_limit
	 */
	public function test_index() {
		$expected_query = "
			SELECT term_id
			FROM wp_term_taxonomy AS T
			LEFT JOIN wp_yoast_indexable AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.version = %d
			WHERE I.object_id IS NULL
				AND taxonomy IN (%s, %s)
			LIMIT %d";

		Filters\expectApplied( 'wpseo_term_indexation_limit' )->andReturn( 25 );

		$this->taxonomy->expects( 'get_public_taxonomies' )->once()->andReturn(
			[
				'public_taxonomy' => 'public_taxonomy',
				'other_taxonomy'  => 'other_taxonomy',
			]
		);
		$this->wpdb->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 2, 'public_taxonomy', 'other_taxonomy', 25 ] )
			->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( [ '1', '3', '8' ] );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'term' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'term' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'term' );

		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_terms' );
		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_terms_limited' );

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

		$this->taxonomy->expects( 'get_public_taxonomies' )->once()->andReturn( [ 'public_taxonomy' => 'public_taxonomy' ] );
		$this->wpdb->expects( 'prepare' )->once()->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( [ '1', '3', '8' ] );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'term' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'term' );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'term' );

		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_terms' );
		Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_terms_limited' );

		$this->instance->index();
	}

	/**
	 * Tests that the transients are not deleted when no indexables have been created.
	 *
	 * @covers ::__construct
	 * @covers ::index
	 * @covers ::get_limit
	 */
	public function test_index_no_indexables_created() {
		$expected_query = "
			SELECT term_id
			FROM wp_term_taxonomy AS T
			LEFT JOIN wp_yoast_indexable AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.version = %d
			WHERE I.object_id IS NULL
				AND taxonomy IN (%s, %s)
			LIMIT %d";

		Filters\expectApplied( 'wpseo_term_indexation_limit' )->andReturn( 25 );

		$this->taxonomy->expects( 'get_public_taxonomies' )->once()->andReturn(
			[
				'public_taxonomy' => 'public_taxonomy',
				'other_taxonomy'  => 'other_taxonomy',
			]
		);
		$this->wpdb->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 2, 'public_taxonomy', 'other_taxonomy', 25 ] )
			->andReturn( 'query' );
		$this->wpdb->expects( 'get_col' )->once()->with( 'query' )->andReturn( [] );

		$this->instance->index();
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use wpdb;
use Yoast\WP\SEO\Actions\Indexing\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Term_Link_Indexing_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Term_Link_Indexing_Action
 */
class Term_Link_Indexing_Action_Test extends TestCase {

	/**
	 * The link builder.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $link_builder;

	/**
	 * The post type helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	private $wpdb;

	/**
	 * The instance.
	 *
	 * @var Term_Link_Indexing_Action
	 */
	protected $instance;

	/**
	 * Set up the tests.
	 */
	protected function set_up() {
		parent::set_up();

		global $wpdb;
		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Intended, to be able to test the Abstract_Link_Indexing_Action.
		$wpdb = (object) [ 'prefix' => 'wp_' ];

		$this->link_builder        = Mockery::mock( Indexable_Link_Builder::class );
		$this->taxonomy_helper     = Mockery::mock( Taxonomy_Helper::class );
		$this->repository          = Mockery::mock( Indexable_Repository::class );
		$this->wpdb                = Mockery::mock( 'wpdb' );
		$this->wpdb->term_taxonomy = 'wp_term_taxonomy';

		$this->instance = new Term_Link_Indexing_Action(
			$this->link_builder,
			$this->repository,
			$this->wpdb
		);
		$this->instance->set_helper( $this->taxonomy_helper );
	}

	/**
	 * Tests setting the helper.
	 *
	 * @covers ::set_helper
	 */
	public function test_set_helper() {
		$this->instance->set_helper( Mockery::mock( Taxonomy_Helper::class ) );

		static::assertInstanceOf(
			Taxonomy_Helper::class,
			$this->getPropertyValue( $this->instance, 'taxonomy_helper' )
		);
	}

	/**
	 * Tests getting the unindexed count with a limit.
	 *
	 * @covers ::get_count_query
	 * @covers \Yoast\WP\SEO\Actions\Indexation\Abstract_Link_Indexing_Action::get_total_unindexed
	 */
	public function test_get_total_unindexed() {
		$expected_query = "
			SELECT COUNT(T.term_id)
			FROM wp_term_taxonomy AS T
			LEFT JOIN wp_yoast_indexable AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.link_count IS NOT NULL
			WHERE I.object_id IS NULL
				AND T.taxonomy IN (%s, %s)";

		Functions\expect( 'get_transient' )
			->once()
			->with( Term_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT )
			->andReturn( false );

		$this->taxonomy_helper
			->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( [ 'category', 'tag' ] );

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'category', 'tag' ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_var' )
			->once()
			->with( 'query' )
			->andReturn( '10' );

		Functions\expect( 'set_transient' )
			->once()
			->with( Term_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT, '10', \DAY_IN_SECONDS )
			->andReturn( true );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests get_limited_unindexed_count with a limit.
	 *
	 * @covers ::get_count_query
	 * @covers ::get_total_unindexed
	 * @covers \Yoast\WP\SEO\Actions\Indexation\Abstract_Link_Indexing_Action::get_limited_unindexed_count
	 */
	public function test_get_limited_unindexed_count() {
		$expected_query = "
			SELECT COUNT(T.term_id)
			FROM wp_term_taxonomy AS T
			LEFT JOIN wp_yoast_indexable AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.link_count IS NOT NULL
			WHERE I.object_id IS NULL
				AND T.taxonomy IN (%s, %s)";

		Functions\expect( 'get_transient' )
			->once()
			->with( Term_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT )
			->andReturn( false );

		$this->taxonomy_helper
			->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( [ 'category', 'tag' ] );

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'category', 'tag' ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_var' )
			->once()
			->with( 'query' )
			->andReturn( '10' );

		Functions\expect( 'set_transient' )
			->once()
			->with( Term_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT, '10', \DAY_IN_SECONDS )
			->andReturn( true );

		$this->assertEquals( 10, $this->instance->get_limited_unindexed_count() );
	}

	/**
	 * Tests getting the total unindexed.
	 *
	 * @covers \Yoast\WP\SEO\Actions\Indexation\Abstract_Link_Indexing_Action::get_total_unindexed
	 */
	public function test_get_total_unindexed_cached() {
		Functions\expect( 'get_transient' )
			->once()
			->with( Term_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT )
			->andReturn( '25' );

		$this->assertEquals( 25, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests getting the total unindexed.
	 *
	 * @covers \Yoast\WP\SEO\Actions\Indexation\Abstract_Link_Indexing_Action::get_total_unindexed
	 */
	public function test_get_total_unindexed_failed_query() {
		Functions\expect( 'get_transient' )
			->once()
			->with( Term_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT )
			->andReturn( false );

		Functions\expect( 'set_transient' )
			->once()
			->with( Term_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT, 0, ( \MINUTE_IN_SECONDS * 15 ) )
			->andReturn( true );

		$this->taxonomy_helper
			->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( [ 'category', 'tag' ] );

		$expected_query = "
			SELECT COUNT(T.term_id)
			FROM wp_term_taxonomy AS T
			LEFT JOIN wp_yoast_indexable AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.link_count IS NOT NULL
			WHERE I.object_id IS NULL
				AND T.taxonomy IN (%s, %s)";

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'category', 'tag' ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_var' )
			->once()
			->with( 'query' )
			->andReturn( null );

		$this->assertFalse( $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the index function.
	 *
	 * @covers ::get_objects
	 * @covers \Yoast\WP\SEO\Actions\Indexation\Abstract_Link_Indexing_Action::index
	 */
	public function test_index() {
		Filters\expectApplied( 'wpseo_link_indexing_limit' );

		$terms = [
			(object) [
				'term_id'     => 1,
				'description' => 'foo',
			],
			(object) [
				'term_id'     => 3,
				'description' => 'foo',
			],
			(object) [
				'term_id'     => 8,
				'description' => 'foo',
			],
		];

		$this->taxonomy_helper
			->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( [ 'category', 'tag' ] );

		$expected_query = "
			SELECT T.term_id, T.description
			FROM wp_term_taxonomy AS T
			LEFT JOIN wp_yoast_indexable AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.link_count IS NOT NULL
			WHERE I.object_id IS NULL
				AND T.taxonomy IN (%s, %s)
			LIMIT %d";

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'category', 'tag', 5 ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_results' )
			->once()
			->with( 'query' )
			->andReturn( $terms );

		foreach ( $terms as $term ) {
			$indexable             = Mockery::mock( Indexable_Mock::class );
			$indexable->link_count = 10;
			$indexable->expects( 'save' )->once();

			$this->link_builder->expects( 'build' )->with( $indexable, $term->description );

			$this->repository->expects( 'find_by_id_and_type' )->once()->with( $term->term_id, 'term' )->andReturn( $indexable );
		}

		Functions\expect( 'delete_transient' )->once()->with( Term_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT );

		$this->instance->index();
	}

	/**
	 * Tests the index function.
	 *
	 * @covers ::get_objects
	 * @covers \Yoast\WP\SEO\Actions\Indexation\Abstract_Link_Indexing_Action::index
	 */
	public function test_index_without_link_count() {
		Filters\expectApplied( 'wpseo_link_indexing_limit' );

		$this->taxonomy_helper
			->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( [ 'category', 'tag' ] );

		$expected_query = "
			SELECT T.term_id, T.description
			FROM wp_term_taxonomy AS T
			LEFT JOIN wp_yoast_indexable AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.link_count IS NOT NULL
			WHERE I.object_id IS NULL
				AND T.taxonomy IN (%s, %s)
			LIMIT %d";

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'category', 'tag', 5 ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_results' )
			->once()
			->with( 'query' )
			->andReturn(
				[
					(object) [
						'term_id'     => 1,
						'description' => 'foo',
					],
					(object) [
						'term_id'     => 3,
						'description' => 'foo',
					],
					(object) [
						'term_id'     => 8,
						'description' => 'foo',
					],
				]
			);

		$indexable             = Mockery::mock( Indexable_Mock::class );
		$indexable->link_count = null;
		$indexable->expects( 'save' )->times( 3 );

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 1, 'term' )->andReturn( $indexable );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 3, 'term' )->andReturn( $indexable );
		$this->repository->expects( 'find_by_id_and_type' )->once()->with( 8, 'term' )->andReturn( $indexable );
		$this->link_builder->expects( 'build' )->times( 3 )->with( $indexable, 'foo' );

		Functions\expect( 'delete_transient' )->once()->with( Term_Link_Indexing_Action::UNINDEXED_COUNT_TRANSIENT );

		$this->instance->index();
	}

	/**
	 * Tests that the transients are not deleted when no indexables have been created.
	 *
	 * @covers ::get_objects
	 */
	public function test_index_no_indexables_created() {
		Filters\expectApplied( 'wpseo_link_indexing_limit' );

		$this->taxonomy_helper
			->expects( 'get_public_taxonomies' )
			->once()
			->andReturn( [ 'category', 'tag' ] );

		$expected_query = "
			SELECT T.term_id, T.description
			FROM wp_term_taxonomy AS T
			LEFT JOIN wp_yoast_indexable AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.link_count IS NOT NULL
			WHERE I.object_id IS NULL
				AND T.taxonomy IN (%s, %s)
			LIMIT %d";

		$this->wpdb
			->expects( 'prepare' )
			->once()
			->with( $expected_query, [ 'category', 'tag', 5 ] )
			->andReturn( 'query' );

		$this->wpdb
			->expects( 'get_results' )
			->once()
			->with( 'query' )
			->andReturn( [] );

		$this->instance->index();
	}
}

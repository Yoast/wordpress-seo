<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Indexing;

use Brain\Monkey;
use Mockery;
use Mockery\MockInterface;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Indexable_Post_Type_Archive_Indexation_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Indexable_Post_Type_Archive_Indexation_Action_Test extends TestCase {

	/**
	 * The indexable builder mock.
	 *
	 * @var Indexable_Builder|MockInterface
	 */
	protected $builder;

	/**
	 * The post type helper mock.
	 *
	 * @var Post_Type_Helper|MockInterface
	 */
	protected $post_type;

	/**
	 * The indexable repository mock.
	 *
	 * @var Indexable_Repository|MockInterface
	 */
	protected $repository;

	/**
	 * The indexation action for post type archives.
	 *
	 * @var Indexable_Post_Type_Archive_Indexation_Action
	 */
	protected $instance;

	/**
	 * Contains the latest version of each indexable builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder_Versions
	 */
	protected $versions;

	/**
	 * Set up the mocks before each test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->repository = Mockery::mock( Indexable_Repository::class );
		$this->builder    = Mockery::mock( Indexable_Builder::class );
		$this->post_type  = Mockery::mock( Post_Type_Helper::class );
		$this->versions   = Mockery::mock( Indexable_Builder_Versions::class );

		$this->versions
			->expects( 'get_latest_version_for_type' )
			->with( 'post-type-archive' )
			->andReturn( 2 );

		$this->instance = new Indexable_Post_Type_Archive_Indexation_Action(
			$this->repository,
			$this->builder,
			$this->post_type,
			$this->versions
		);
	}

	/**
	 * Tests the constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_constructor() {
		$instance = $this->instance;

		$this->assertEquals( $this->repository, $this->getPropertyValue( $instance, 'repository' ) );
		$this->assertEquals( $this->builder, $this->getPropertyValue( $instance, 'builder' ) );
		$this->assertEquals( $this->post_type, $this->getPropertyValue( $instance, 'post_type' ) );
		$this->assertEquals( 2, $this->getPropertyValue( $instance, 'version' ) );
	}

	/**
	 * Tests the get total unindexed method.
	 *
	 * @covers ::get_total_unindexed
	 * @covers ::get_unindexed_post_type_archives
	 * @covers ::get_post_types_with_archive_pages
	 * @covers ::get_indexed_post_type_archives
	 */
	public function test_get_total_unindexed() {
		$public_post_types = [
			[
				'name'        => 'movies',
				'has_archive' => true,
			],
			[
				'name'        => 'books',
				'has_archive' => true,
			],
			[
				'name'        => 'posts',
				'has_archive' => false,
			],
		];

		$indexed_post_types = [ 'books' ];

		Monkey\Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_post_type_archives' )->andReturnFalse();
		Monkey\Functions\expect( 'set_transient' )->once()->with( 'wpseo_total_unindexed_post_type_archives', 1, \DAY_IN_SECONDS )->andReturnTrue();

		$this->set_expectations_for_post_type_helper( $public_post_types );
		$this->set_expectations_for_repository( $indexed_post_types );

		$this->assertEquals( 1, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the get total unindexed method with cache.
	 *
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed_cached() {
		Monkey\Functions\expect( 'get_transient' )->once()->with( 'wpseo_total_unindexed_post_type_archives' )->andReturn( '10' );

		$this->assertEquals( 10, $this->instance->get_total_unindexed() );
	}

	/**
	 * Tests the index method.
	 *
	 * @covers ::index
	 * @covers ::get_limit
	 * @covers ::get_unindexed_post_type_archives
	 * @covers ::get_post_types_with_archive_pages
	 * @covers ::get_indexed_post_type_archives
	 */
	public function test_index() {
		$public_post_types = [
			[
				'name'        => 'movies',
				'has_archive' => true,
			],
			[
				'name'        => 'books',
				'has_archive' => true,
			],
			[
				'name'        => 'posts',
				'has_archive' => false,
			],
		];

		$indexed_post_types   = [ 'movies' ];
		$unindexed_post_types = [ 'books' ];

		$this->set_expectations_for_post_type_helper( $public_post_types );
		$this->set_expectations_for_repository( $indexed_post_types );

		$expected_indexable_mocks = $this->set_expectations_for_builder( $unindexed_post_types );

		Monkey\Filters\expectApplied( 'wpseo_post_type_archive_indexation_limit' )
			->with( 25 )
			->andReturn( 25 );

		Monkey\Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_post_type_archives' );

		$this->assertEquals( $expected_indexable_mocks, $this->instance->index() );
	}

	/**
	 * Tests that the index method when the limit is set to a negative number.
	 *
	 * @covers ::index
	 * @covers ::get_limit
	 * @covers ::get_unindexed_post_type_archives
	 * @covers ::get_post_types_with_archive_pages
	 * @covers ::get_indexed_post_type_archives
	 */
	public function test_index_when_limit_is_set_to_a_negative_number() {
		$public_post_types = [
			[
				'name'        => 'movies',
				'has_archive' => true,
			],
			[
				'name'        => 'books',
				'has_archive' => true,
			],
			[
				'name'        => 'posts',
				'has_archive' => false,
			],
		];

		$indexed_post_types   = [ 'movies' ];
		$unindexed_post_types = [ 'books' ];

		$this->set_expectations_for_post_type_helper( $public_post_types );
		$this->set_expectations_for_repository( $indexed_post_types );

		$expected_indexable_mocks = $this->set_expectations_for_builder( $unindexed_post_types );

		Monkey\Filters\expectApplied( 'wpseo_post_type_archive_indexation_limit' )
			->with( 25 )
			->andReturn( -1 );

		Monkey\Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_post_type_archives' );

		$this->assertEquals( $expected_indexable_mocks, $this->instance->index() );
	}

	/**
	 * Tests that the index method when the limit is set to a negative number.
	 *
	 * @covers ::index
	 * @covers ::get_limit
	 * @covers ::get_unindexed_post_type_archives
	 * @covers ::get_post_types_with_archive_pages
	 * @covers ::get_indexed_post_type_archives
	 */
	public function test_index_when_limit_is_not_an_integer() {
		$public_post_types = [
			[
				'name'        => 'movies',
				'has_archive' => true,
			],
			[
				'name'        => 'books',
				'has_archive' => true,
			],
			[
				'name'        => 'posts',
				'has_archive' => false,
			],
		];

		$indexed_post_types   = [ 'movies' ];
		$unindexed_post_types = [ 'books' ];

		$this->set_expectations_for_post_type_helper( $public_post_types );
		$this->set_expectations_for_repository( $indexed_post_types );

		$expected_indexable_mocks = $this->set_expectations_for_builder( $unindexed_post_types );

		Monkey\Filters\expectApplied( 'wpseo_post_type_archive_indexation_limit' )
			->with( 25 )
			->andReturn( 'not an integer' );

		Monkey\Functions\expect( 'delete_transient' )->with( 'wpseo_total_unindexed_post_type_archives' );

		$this->assertEquals( $expected_indexable_mocks, $this->instance->index() );
	}

	/**
	 * Tests that the transients are not deleted when no indexables have been created.
	 *
	 * @covers ::index
	 * @covers ::get_limit
	 * @covers ::get_unindexed_post_type_archives
	 * @covers ::get_post_types_with_archive_pages
	 * @covers ::get_indexed_post_type_archives
	 */
	public function test_index_no_indexables_created() {
		$public_post_types = [
			[
				'name'        => 'movies',
				'has_archive' => true,
			],
			[
				'name'        => 'books',
				'has_archive' => true,
			],
			[
				'name'        => 'posts',
				'has_archive' => true,
			],
		];

		$indexed_post_types = [ 'movies', 'books', 'posts' ];

		$this->set_expectations_for_post_type_helper( $public_post_types );
		$this->set_expectations_for_repository( $indexed_post_types );

		Monkey\Filters\expectApplied( 'wpseo_post_type_archive_indexation_limit' )
			->with( 25 )
			->andReturn( 25 );

		$this->assertEquals( [], $this->instance->index() );
	}

	/**
	 * Sets the expectations for the post type helper.
	 *
	 * @param array $public_post_types The public post types.
	 */
	private function set_expectations_for_post_type_helper( $public_post_types ) {
		$post_type_objects = [];
		foreach ( $public_post_types as $post_type ) {
			$post_type_objects[] = (object) $post_type;
		}

		$this->post_type->expects( 'get_public_post_types' )
			->andReturn( $post_type_objects );

		foreach ( $post_type_objects as $post_type_object ) {
			$this->post_type->expects( 'has_archive' )
				->with( $post_type_object )
				->andReturn( $post_type_object->has_archive );
		}
	}

	/**
	 * Sets the expectations for the indexable repository.
	 *
	 * @param array $post_types The post types for which to return indexables.
	 */
	private function set_expectations_for_repository( $post_types ) {
		$callback = static function( $post_type ) {
			return [ 'object_sub_type' => $post_type ];
		};
		$results  = \array_map( $callback, $post_types );

		$query_mock = Mockery::mock( ORM::class );
		$query_mock->expects( 'select' )->once()->with( 'object_sub_type' )->andReturn( $query_mock );
		$query_mock->expects( 'where' )->once()->with( 'object_type', 'post-type-archive' )->andReturn( $query_mock );
		$query_mock->expects( 'where_equal' )->once()->with( 'version', 2 )->andReturn( $query_mock );
		$query_mock->expects( 'find_array' )->once()->andReturn( $results );

		$this->repository->expects( 'query' )->once()->andReturn( $query_mock );
	}

	/**
	 * Sets the expectations for the indexable builder.
	 *
	 * @param array $post_types The list of post type names.
	 *
	 * @return array The indexable mocks.
	 */
	private function set_expectations_for_builder( $post_types ) {
		$indexable_mocks = [];
		foreach ( $post_types as $post_type ) {
			$indexable_mock    = Mockery::mock( Indexable_Mock::class );
			$indexable_mocks[] = $indexable_mock;

			$this->builder->expects( 'build_for_post_type_archive' )
				->with( $post_type )
				->andReturn( $indexable_mock );
		}

		return $indexable_mocks;
	}
}

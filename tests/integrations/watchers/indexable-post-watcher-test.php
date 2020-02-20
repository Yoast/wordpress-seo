<?php

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Doubles\Indexable_Post_Watcher_Double;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Post_Test.
 *
 * @group indexables
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Watcher_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository;

	/**
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder;

	/**
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Repository
	 */
	private $hierarchy_repository;

	/**
	 * The author archive helper mock.
	 *
	 * @var Mockery\MockInterface|Author_Archive_Helper
	 */
	private $author_archive;

	/**
	 * @var Indexable_Post_Watcher
	 */
	private $instance;

	/**
	 * Initializes the test mocks.
	 */
	public function setUp() {
		$this->repository           = Mockery::mock( Indexable_Repository::class );
		$this->builder              = Mockery::mock( Indexable_Builder::class );
		$this->hierarchy_repository = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->author_archive       = Mockery::mock( Author_Archive_Helper::class );
		$this->instance             = Mockery::mock(
			Indexable_Post_Watcher::class,
			[
				$this->repository,
				$this->builder,
				$this->hierarchy_repository,
				$this->author_archive,
			]
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		return parent::setUp();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Post_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'wp_insert_post', [ $this->instance, 'build_indexable' ] ) );
		$this->assertNotFalse( \has_action( 'delete_post', [ $this->instance, 'delete_indexable' ] ) );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable() {
		$id   = 1;
		$post = (object) [
			'post_author' => 0,
			'post_type'   => 'post',
			'ID'          => 0,
		];

		$indexable = Mockery::mock();
		$indexable->id = 1;
		$indexable->is_public = true;
		$indexable->object_type = 'post';
		$indexable->expects( 'delete' )->once();

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable );
		$this->hierarchy_repository->expects( 'clear_ancestors' )->once()->with( $id )->andReturn( true );

		Monkey\Functions\expect( 'get_post' )->once()->with( $id )->andReturn( $post );

		$this->instance
			->expects( 'update_relations' )
			->with( $post )
			->once();

		$this->instance
			->expects( 'update_has_public_posts' )
			->with( $indexable )
			->once();

		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable_does_not_exist() {
		$id = 1;

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( false );

		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 * @covers ::is_post_indexable
	 */
	public function test_build_indexable() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( false );
		Monkey\Functions\expect( 'wp_is_post_autosave' )->once()->with( $id )->andReturn( false );

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable_mock );
		$this->repository->expects( 'create_for_id_and_type' )->never();
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( $id, 'post', $indexable_mock )->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the early return for non-indexable post.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_is_post_revision() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( true );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the early return for non-indexable post.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_is_post_autosave() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( false );
		Monkey\Functions\expect( 'wp_is_post_autosave' )->once()->with( $id )->andReturn( true );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_does_not_exist() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( false );
		Monkey\Functions\expect( 'wp_is_post_autosave' )->once()->with( $id )->andReturn( false );

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( false );
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the updated where the indexable isn't for a post.
	 *
	 * @covers ::updated_indexable
	 */
	public function test_updated_indexable_non_post() {
		$this->instance
			->expects( 'update_relations' )
			->never();

		$old_indexable     = Mockery::mock();
		$updated_indexable = Mockery::mock();
		$updated_indexable->object_type = 'term';

		$this->instance->updated_indexable( $updated_indexable, $old_indexable );
	}

	/**
	 * Tests the updated indexable method with no transition in status.
	 *
	 * @covers ::updated_indexable
	 */
	public function test_updated_indexable_not_public_and_no_transition() {
		$this->instance
			->expects( 'update_relations' )
			->never();

		$old_indexable            = Mockery::mock();
		$old_indexable->is_public = false;

		$updated_indexable              = Mockery::mock();
		$updated_indexable->object_type = 'post';
		$updated_indexable->is_public   = false;

		$this->instance
			->expects( 'update_has_public_posts' )
			->with( $updated_indexable )
			->once();

		$this->instance->updated_indexable( $updated_indexable, $old_indexable );
	}

	/**
	 * Tests the updated indexable method with a transition in status.
	 *
	 * @covers ::updated_indexable
	 */
	public function test_updated_indexable_public_transition() {
		$this->instance
			->expects( 'update_relations' )
			->with( [] )
			->once();

		$old_indexable            = Mockery::mock();
		$old_indexable->is_public = true;

		$updated_indexable              = Mockery::mock();
		$updated_indexable->object_type = 'post';
		$updated_indexable->is_public   = false;
		$updated_indexable->object_id   = 1;

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1 )->andReturn( [] );

		$this->instance
			->expects( 'update_has_public_posts' )
			->with( $updated_indexable )
			->once();

		$this->instance->updated_indexable( $updated_indexable, $old_indexable );
	}

	/**
	 * Tests that update_has_public_posts updates the author archive too.
	 *
	 * @covers ::update_has_public_posts
	 */
	public function test_update_has_public_posts_with_post() {
		$instance = new Indexable_Post_Watcher_Double(
			$this->repository,
			$this->builder,
			$this->hierarchy_repository,
			$this->author_archive
		);

		$post_indexable                  = Mockery::mock();
		$post_indexable->object_sub_type = 'post';
		$post_indexable->author_id       = 1;

		$author_indexable            = Mockery::mock();
		$author_indexable->object_id = 11;

		$this->repository->expects( 'find_by_id_and_type' )->with( 1, 'user' )->once()->andReturn( $author_indexable );
		$this->author_archive->expects( 'author_has_public_posts' )->with( 11 )->once()->andReturn( true );
		$author_indexable->expects( 'save' )->once();

		$instance->update_has_public_posts( $post_indexable );

		$this->assertTrue( $author_indexable->has_public_posts );
	}

	/**
	 * Tests that update_has_public_posts updates the author archive .
	 *
	 * @covers ::update_has_public_posts
	 */
	public function test_update_has_public_posts_with_post_throwing_exceptions() {
		$instance = new Indexable_Post_Watcher_Double(
			$this->repository,
			$this->builder,
			$this->hierarchy_repository,
			$this->author_archive
		);

		$post_indexable                  = Mockery::mock();
		$post_indexable->object_sub_type = 'post';
		$post_indexable->author_id       = 1;

		$this->repository->expects( 'find_by_id_and_type' )->with( 1, 'user' )->once()->andThrow( new \Exception() );
		$this->author_archive->expects( 'author_has_public_posts' )->never();

		$instance->update_has_public_posts( $post_indexable );
	}
}

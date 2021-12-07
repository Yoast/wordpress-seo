<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Watchers;

use Brain\Monkey;
use Exception;
use Mockery;
use WP_Post;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\SEO\Loggers\Logger;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Integrations\Watchers\Indexable_Post_Watcher_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Post_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher
 */
class Indexable_Post_Watcher_Test extends TestCase {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository;

	/**
	 * Represents the indexable builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder;

	/**
	 * Represents the hierarchy repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Repository
	 */
	private $hierarchy_repository;

	/**
	 * The link builder.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $link_builder;

	/**
	 * The author archive helper mock.
	 *
	 * @var Mockery\MockInterface|Author_Archive_Helper
	 */
	private $author_archive;

	/**
	 * Represents the class we are testing.
	 *
	 * @var Indexable_Post_Watcher_Double
	 */
	private $instance;

	/**
	 * Holds the Post_Helper instance.
	 *
	 * @var Post_Helper|Mockery\MockInterface
	 */
	private $post;

	/**
	 * Holds the Logger instance.
	 *
	 * @var Logger|Mockery\MockInterface
	 */
	private $logger;

	/**
	 * Initializes the test mocks.
	 */
	protected function set_up() {
		parent::set_up();

		$this->repository           = Mockery::mock( Indexable_Repository::class );
		$this->builder              = Mockery::mock( Indexable_Builder::class );
		$this->hierarchy_repository = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->link_builder         = Mockery::mock( Indexable_Link_Builder::class );
		$this->author_archive       = Mockery::mock( Author_Archive_Helper::class );
		$this->post                 = Mockery::mock( Post_Helper::class );
		$this->logger               = Mockery::mock( Logger::class );
		$this->instance             = Mockery::mock(
			Indexable_Post_Watcher_Double::class,
			[
				$this->repository,
				$this->builder,
				$this->hierarchy_repository,
				$this->link_builder,
				$this->author_archive,
				$this->post,
				$this->logger,
			]
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();
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

		$indexable              = Mockery::mock();
		$indexable->id          = 1;
		$indexable->is_public   = true;
		$indexable->object_type = 'post';
		$indexable->expects( 'delete' )->once();

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable );
		$this->hierarchy_repository->expects( 'clear_ancestors' )->once()->with( $id )->andReturn( true );
		$this->link_builder->expects( 'delete' )->once()->with( $indexable );

		$this->post->expects( 'get_post' )->once()->with( $id )->andReturn( $post );

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
	 */
	public function test_build_indexable() {
		$post_id      = 1;
		$post_content = '<p>A post with a <a href="https://example.com/post-2">a link</a>.</p>';
		$post         = (object) [
			'post_content' => $post_content,
			'post_status'  => 'publish',
		];

		$indexable_mock = Mockery::mock( Indexable_Mock::class );

		$indexable_mock
			->expects( 'save' )
			->once();

		$this->repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( $post_id, 'post', false )
			->andReturn( $indexable_mock );

		$this->repository->expects( 'create_for_id_and_type' )->never();
		$this->builder
			->expects( 'build_for_id_and_type' )
			->once()
			->with( $post_id, 'post', $indexable_mock )
			->andReturn( $indexable_mock );

		$this->post
			->expects( 'get_post' )
			->once()
			->with( $post_id )
			->andReturn( $post );

		$this->post
			->expects( 'get_public_post_statuses' )
			->once()
			->andReturn( [ 'publish' ] );

		$this->link_builder
			->expects( 'build' )
			->once()
			->with( $indexable_mock, $post_content );

		$this->instance->build_indexable( $post_id );
	}

	/**
	 * Tests the build indexable functionality for a multisite that has been switched.
	 *
	 * @covers ::build_indexable
	 * @covers ::is_multisite_and_switched
	 */
	public function test_build_indexable_is_multisite_and_switched() {
		$id = 1;

		$this->instance
			->expects( 'is_multisite_and_switched' )
			->once()
			->andReturnTrue();

		$this->repository
			->expects( 'find_by_id_and_type' )
			->never()
			->with( $id, 'post', false );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the build_indexable functionality with an exception being thrown.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_with_thrown_exception() {
		$post_id = 1;

		$this->instance
			->expects( 'is_multisite_and_switched' )
			->once()
			->andReturnFalse();

		$indexable_mock = Mockery::mock( Indexable_Mock::class );
		$indexable_mock->expects( 'save' )->never();

		$this->repository->expects( 'find_by_id_and_type' )
			->once()
			->with( $post_id, 'post', false )
			->andThrow( new Exception( 'an error' ) );

		$this->logger->expects( 'log' )->once()->with( 'error', 'an error' );

		$this->instance->build_indexable( $post_id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_does_not_exist() {
		$post_id      = 1;
		$post_content = '<p>A post with a <a href="https://example.com/post-2">a link</a>.</p>';
		$post         = (object) [
			'post_content' => $post_content,
			'post_status'  => 'publish',
		];

		$indexable_mock = Mockery::mock( Indexable_Mock::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository->expects( 'find_by_id_and_type' )->once()->with( $post_id, 'post', false )->andReturn( false );
		$this->builder->expects( 'build_for_id_and_type' )->once()->with( $post_id, 'post', false )->andReturn( $indexable_mock );

		$this->post
			->expects( 'get_post' )
			->once()
			->with( $post_id )
			->andReturn( $post );

		$this->link_builder
			->expects( 'build' )
			->once()
			->with( $indexable_mock, $post_content );

		$this->post
			->expects( 'get_public_post_statuses' )
			->once()
			->andReturn( [ 'publish' ] );

		$this->instance->build_indexable( $post_id );
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

		$post                   = Mockery::mock( 'WP_Post' );
		$indexable              = Mockery::mock( Indexable_Mock::class );
		$indexable->object_type = 'term';

		$this->instance->updated_indexable( $indexable, $post );
	}

	/**
	 * Tests that update_has_public_posts updates the author archive too.
	 *
	 * @covers ::update_has_public_posts
	 */
	public function test_update_has_public_posts_with_post() {
		$post_indexable                  = Mockery::mock();
		$post_indexable->object_id       = 33;
		$post_indexable->object_sub_type = 'post';
		$post_indexable->author_id       = 1;
		$post_indexable->is_public       = null;

		$author_indexable            = Mockery::mock( Indexable_Mock::class );
		$author_indexable->object_id = 11;

		$this->repository
			->expects( 'find_by_id_and_type' )
			->with( 1, 'user' )
			->once()
			->andReturn( $author_indexable );

		$this->author_archive
			->expects( 'author_has_public_posts' )
			->with( 11 )
			->once()
			->andReturn( true );
		$author_indexable->expects( 'save' )->once();

		$this->post->expects( 'update_has_public_posts_on_attachments' )->once()->with( 33, null )->andReturnTrue();

		$this->instance->update_has_public_posts( $post_indexable );

		$this->assertTrue( $author_indexable->has_public_posts );
	}

	/**
	 * Tests that update_has_public_posts updates the author archive .
	 *
	 * @covers ::update_has_public_posts
	 */
	public function test_update_has_public_posts_with_post_throwing_exceptions() {
		$post_indexable                  = Mockery::mock();
		$post_indexable->object_id       = 33;
		$post_indexable->object_sub_type = 'post';
		$post_indexable->author_id       = 1;
		$post_indexable->is_public       = null;

		$this->repository->expects( 'find_by_id_and_type' )
			->with( 1, 'user' )
			->once()
			->andThrow( new Exception( 'an error' ) );
		$this->author_archive->expects( 'author_has_public_posts' )->never();
		$this->post->expects( 'update_has_public_posts_on_attachments' )
			->once()
			->with( 33, null )
			->andReturnTrue();
		$this->logger->expects( 'log' )->once()->with( 'error', 'an error' );

		$this->instance->update_has_public_posts( $post_indexable );
	}

	/**
	 * Tests the routine for updating the relations.
	 *
	 * @covers ::update_relations
	 */
	public function test_update_relations() {
		$post = (object) [
			'post_author'       => 1,
			'post_type'         => 'post',
			'ID'                => 1,
			'post_modified_gmt' => '1234-12-12 12:12:12',
		];

		$indexable      = Mockery::mock( Indexable_Mock::class );
		$indexable->orm = Mockery::mock( ORM::class );
		$indexable->orm->expects( 'get' )->with( 'object_last_modified' )->andReturn( '1234-12-12 00:00:00' );
		$indexable->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 12:12:12' );
		$indexable->expects( 'save' )->once();

		$this->instance
			->expects( 'get_related_indexables' )
			->once()
			->with( $post )
			->andReturn( [ $indexable ] );

		$this->instance->update_relations( $post );
	}

	/**
	 * Tests the routine for updating the relations with no related indexables found.
	 *
	 * @covers ::update_relations
	 */
	public function test_update_relations_with_no_indexables_found() {
		$post = (object) [
			'post_author' => 1,
			'post_type'   => 'post',
			'ID'          => 1,
		];

		$this->instance
			->expects( 'get_related_indexables' )
			->once()
			->with( $post )
			->andReturn( [] );

		$this->instance->update_relations( $post );
	}

	/**
	 * Tests the retrieval of the related indexables for a post.
	 *
	 * @covers ::get_related_indexables
	 */
	public function test_get_related_indexables() {
		$post = (object) [
			'post_author' => 1,
			'post_type'   => 'post',
			'ID'          => 1,
		];

		Monkey\Functions\expect( 'get_post_taxonomies' )
			->once()
			->with( 1 )
			->andReturn(
				[
					'taxonomy',
					'another-taxonomy',
				]
			);

		Monkey\Functions\expect( 'is_taxonomy_viewable' )
			->once()
			->with( 'taxonomy' )
			->andReturn( true );

		Monkey\Functions\expect( 'is_taxonomy_viewable' )
			->once()
			->with( 'another-taxonomy' )
			->andReturn( true );

		Monkey\Functions\expect( 'get_the_terms' )
			->once()
			->with( 1, 'taxonomy' )
			->andReturn(
				[
					(object) [
						'term_id' => 1337,
					],
					(object) [
						'term_id' => 1414,
					],
				]
			);

		Monkey\Functions\expect( 'get_the_terms' )
			->once()
			->with( 1, 'another-taxonomy' )
			->andReturnNull();

		Monkey\Functions\expect( 'wp_list_pluck' )
			->once()
			->with(
				[
					(object) [
						'term_id' => 1337,
					],
					(object) [
						'term_id' => 1414,
					],
				],
				'term_id'
			)
			->andReturn( [ 1337, 1414 ] );

		$indexable = Mockery::mock( Indexable_Mock::class );

		$this->repository
			->expects( 'find_by_id_and_type' )
			->once()
			->with( 1, 'user', false )
			->andReturn( $indexable );

		$this->repository
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'post', false )
			->andReturn( $indexable );

		$this->repository
			->expects( 'find_for_home_page' )
			->once()
			->with( false )
			->andReturn( $indexable );

		$this->repository
			->expects( 'find_by_multiple_ids_and_type' )
			->once()
			->with( [ 1337, 1414 ], 'term', false )
			->andReturn( [ $indexable, null ] );

		$this->assertEquals(
			[ $indexable, $indexable, $indexable, $indexable ],
			$this->instance->get_related_indexables( $post )
		);
	}
}

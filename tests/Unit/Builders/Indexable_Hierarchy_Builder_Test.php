<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey;
use Mockery;
use WPSEO_Meta;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Primary_Term_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder
 *
 * @package Yoast\Tests\Builders
 */
final class Indexable_Hierarchy_Builder_Test extends TestCase {

	/**
	 * Holds the Indexable_Helper instance.
	 *
	 * @var Mockery\MockInterface|Indexable_Helper
	 */
	private $indexable_helper;

	/**
	 * Holds the Indexable_Hierarchy_Repository instance.
	 *
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Repository
	 */
	private $indexable_hierarchy_repository;

	/**
	 * Holds the Primary_Term_Repository instance.
	 *
	 * @var Mockery\MockInterface|Primary_Term_Repository
	 */
	private $primary_term_repository;

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * Holds the Indexable_Repository instance.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Holds the Indexable_Hierarchy_Builder instance.
	 *
	 * @var Indexable_Hierarchy_Builder
	 */
	private $instance;

	/**
	 * Holds the Post_Helper instance.
	 *
	 * @var Post_Helper|Mockery\MockInterface
	 */
	protected $post;

	/**
	 * Runs the setup steps.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->indexable_hierarchy_repository = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->primary_term_repository        = Mockery::mock( Primary_Term_Repository::class );
		$this->options                        = Mockery::mock( Options_Helper::class );
		$this->indexable_repository           = Mockery::mock( Indexable_Repository::class );
		$this->post                           = Mockery::mock( Post_Helper::class );
		$this->indexable_helper               = Mockery::mock( Indexable_Helper::class );

		$this->instance = new Indexable_Hierarchy_Builder(
			$this->indexable_hierarchy_repository,
			$this->primary_term_repository,
			$this->options,
			$this->post,
			$this->indexable_helper
		);
		$this->instance->set_indexable_repository( $this->indexable_repository );
	}

	/**
	 * Tests building the hierarchy of a post where the post parent is set to 0.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_no_parents() {
		$indexable                = new Indexable_Mock();
		$indexable->id            = 1;
		$indexable->object_type   = 'post';
		$indexable->object_id     = 1;
		$indexable->has_ancestors = true;
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturnTrue();
		$this->options->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( '0' );
		$this->post->expects( 'get_post' )
			->with( 1 )
			->andReturn(
				(object) [
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 0, 0 );

		$actual = $this->instance->build( $indexable );
		$this->assertEmpty( $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post where the post parent is set to 0.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_no_parents_and_has_ancestors_set_to_false() {
		$indexable                = $this->get_indexable( 1, 'post' );
		$indexable->has_ancestors = false;
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository
			->expects( 'clear_ancestors' )
			->once();

		$this->options
			->expects( 'get' )
			->with( 'post_types-post-maintax' )
			->andReturn( '0' );

		$this->post
			->expects( 'get_post' )
			->with( 1 )
			->andReturn(
				(object) [
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 0, 0 );

		$actual = $this->instance->build( $indexable );
		$this->assertEmpty( $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post where the post parent is not set.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 *
	 * @return void
	 */
	public function test_parents_not_set() {
		$indexable                = new Indexable_Mock();
		$indexable->id            = 1;
		$indexable->object_type   = 'post';
		$indexable->object_id     = 1;
		$indexable->has_ancestors = true;
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturnTrue();
		$this->post->expects( 'get_post' )->with( 1 )->andReturn( (object) [ 'post_type' => 'post' ] );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 0, 0 );

		$actual = $this->instance->build( $indexable );
		$this->assertEmpty( $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with post parents.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_post_parents() {
		$indexable                = new Indexable_Mock();
		$indexable->id            = 1;
		$indexable->object_type   = 'post';
		$indexable->object_id     = 1;
		$indexable->has_ancestors = true;

		$parent_indexable                = new Indexable_Mock();
		$parent_indexable->id            = 2;
		$parent_indexable->object_type   = 'post';
		$parent_indexable->object_id     = 2;
		$parent_indexable->has_ancestors = true;

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 2, 1 );

		$this->options->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( '0' );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 2, 'post' )->andReturn( $parent_indexable );
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->post->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'post_parent' => 2,
					'post_type'   => 'post',
				]
			);
		$this->post->expects( 'get_post' )
			->twice()
			->with( 2 )
			->andReturn(
				(object) [
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$actual = $this->instance->build( $indexable );
		$this->assertEquals( [ $parent_indexable ], $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with post parents that has no set id.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_post_parent_with_no_indexable_id_set() {
		$indexable                   = $this->get_indexable( 1, 'post' );
		$parent_indexable            = $this->get_indexable( 0, 'post' );
		$parent_indexable->object_id = 2;
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository
			->expects( 'clear_ancestors' )
			->with( 1 )
			->andReturn( true );

		$this->indexable_hierarchy_repository
			->expects( 'add_ancestor' )
			->with( 1, 0, 1 );

		$this->options
			->expects( 'get' )
			->with( 'post_types-post-maintax' )
			->andReturn( '0' );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( 2, 'post' )
			->andReturn( $parent_indexable );

		$this->post
			->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'post_parent' => 2,
					'post_type'   => 'post',
				]
			);
		$this->post
			->expects( 'get_post' )
			->twice()
			->with( 2 )
			->andReturn(
				(object) [
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$actual = $this->instance->build( $indexable );
		$this->assertEquals( [ $parent_indexable ], $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with post parents where the ancestor is unindexed.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_post_parents_with_an_unindexed_ancestor() {
		$indexable        = $this->get_indexable( 1, 'post' );
		$parent_indexable = $this->get_indexable( 2, 'post' );

		$parent_indexable->post_status = 'unindexed';
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository
			->expects( 'clear_ancestors' )
			->with( 1 )
			->andReturnTrue();

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( 2, 'post' )
			->andReturn( $parent_indexable );

		$this->post
			->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'post_parent' => 2,
					'post_type'   => 'post',
				]
			);

		$this->post
			->expects( 'get_post' )
			->once()
			->with( 2 )
			->andReturn(
				(object) [
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 0, 0 );

		$actual = $this->instance->build( $indexable );
		$this->assertEmpty( $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with post parents already been added.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_post_parents_with_parent_already_added() {
		$indexable        = $this->get_indexable( 1, 'post' );
		$parent_indexable = $this->get_indexable( 2, 'post' );
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository
			->expects( 'clear_ancestors' )
			->with( 1 )
			->andReturnTrue();

		$this->indexable_hierarchy_repository
			->expects( 'add_ancestor' )
			->with( 1, 2, 1 );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->twice()
			->with( 2, 'post' )
			->andReturn( $parent_indexable );

		$this->post
			->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'post_parent' => 2,
					'post_type'   => 'post',
				]
			);

		$this->post
			->expects( 'get_post' )
			->times( 3 )
			->with( 2 )
			->andReturn(
				(object) [
					'post_parent' => 2,
					'post_type'   => 'post',
				]
			);

		$actual = $this->instance->build( $indexable );
		$this->assertEquals( [ $parent_indexable ], $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with having the parent indexable being the main indexable.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_post_parents_having_the_parent_is_the_main_object() {
		$indexable = $this->get_indexable( 1, 'post' );
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository
			->expects( 'clear_ancestors' )
			->with( 1 )
			->andReturnTrue();

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( 2, 'post' )
			->andReturn( $indexable );

		$this->post
			->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'post_parent' => 2,
					'post_type'   => 'post',
				]
			);

		$this->post
			->expects( 'get_post' )
			->once()
			->with( 2 )
			->andReturn(
				(object) [
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 0, 0 );

		$actual = $this->instance->build( $indexable );
		$this->assertEmpty( $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with term parents.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::add_ancestors_for_term
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::get_term_parents
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 * @covers ::get_primary_term_id
	 *
	 * @return void
	 */
	public function test_primary_term_parents() {
		$indexable                = new Indexable_Mock();
		$indexable->id            = 1;
		$indexable->object_type   = 'post';
		$indexable->object_id     = 1;
		$indexable->has_ancestors = true;

		$primary_term          = new Primary_Term_Mock();
		$primary_term->term_id = 2;

		$parent_indexable                = new Indexable_Mock();
		$parent_indexable->id            = 2;
		$parent_indexable->object_type   = 'term';
		$parent_indexable->object_id     = 2;
		$parent_indexable->has_ancestors = true;

		Monkey\Functions\expect( 'get_term' )
			->twice()
			->with( 2 )
			->andReturn(
				(object) [
					'term_id'  => 2,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 2, 1 );
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->primary_term_repository->expects( 'find_by_post_id_and_taxonomy' )->with( 1, 'tag', false )->andReturn( $primary_term );

		$this->options->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( 'tag' );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 2, 'term' )->andReturn( $parent_indexable );

		$this->post->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'ID'          => 1,
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$actual = $this->instance->build( $indexable );
		$this->assertEquals( [ $parent_indexable ], $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with term parents not unindexed.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 * @covers ::get_primary_term_id
	 *
	 * @return void
	 */
	public function test_primary_term_parents_and_term_is_unindexed() {
		$indexable = $this->get_indexable( 1, 'post' );

		$primary_term          = new Primary_Term_Mock();
		$primary_term->term_id = 2;

		$parent_indexable              = $this->get_indexable( 2, 'term' );
		$parent_indexable->post_status = 'unindexed';
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 2 )
			->andReturn(
				(object) [
					'term_id'  => 2,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);

		$this->indexable_hierarchy_repository
			->expects( 'clear_ancestors' )
			->with( 1 )
			->andReturnTrue();

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->with( 1, 'tag', false )
			->andReturn( $primary_term );

		$this->options
			->expects( 'get' )
			->with( 'post_types-post-maintax' )
			->andReturn( 'tag' );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( 2, 'term' )
			->andReturn( $parent_indexable );

		$this->post
			->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'ID'          => 1,
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 0, 0 );

		$actual = $this->instance->build( $indexable );
		$this->assertEmpty( $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with many term parents.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::add_ancestors_for_term
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::get_term_parents
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 * @covers ::get_primary_term_id
	 *
	 * @return void
	 */
	public function test_many_primary_term_parents() {
		$indexable                = new Indexable_Mock();
		$indexable->id            = 1;
		$indexable->object_type   = 'post';
		$indexable->object_id     = 1;
		$indexable->has_ancestors = true;

		$primary_term          = new Primary_Term_Mock();
		$primary_term->term_id = 2;

		$parent_indexable                = new Indexable_Mock();
		$parent_indexable->id            = 2;
		$parent_indexable->object_type   = 'term';
		$parent_indexable->object_id     = 2;
		$parent_indexable->has_ancestors = true;

		$grand_parent_indexable                = new Indexable_Mock();
		$grand_parent_indexable->id            = 3;
		$grand_parent_indexable->object_type   = 'term';
		$grand_parent_indexable->object_id     = 3;
		$grand_parent_indexable->has_ancestors = true;

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 2 )
			->andReturnTrue();

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 2 )
			->andReturn(
				(object) [
					'term_id'  => 2,
					'taxonomy' => 'tag',
					'parent'   => 3,
				]
			);
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 3, 'tag' )
			->andReturn(
				(object) [
					'term_id'  => 3,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 3, 2 );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 2, 1 );

		$this->primary_term_repository->expects( 'find_by_post_id_and_taxonomy' )->with( 1, 'tag', false )->andReturn( $primary_term );

		$this->options->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( 'tag' );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 2, 'term' )->andReturn( $parent_indexable );
		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 3, 'term' )->andReturn( $grand_parent_indexable );

		$this->post->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'ID'          => 1,
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$actual = $this->instance->build( $indexable );
		$this->assertEquals( [ $grand_parent_indexable, $parent_indexable ], $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with term parents.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::add_ancestors_for_term
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::find_deepest_term_id
	 * @covers ::get_term_parents
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 * @covers ::get_primary_term_id
	 *
	 * @return void
	 */
	public function test_term_parent() {
		$indexable                = new Indexable_Mock();
		$indexable->id            = 1;
		$indexable->object_type   = 'post';
		$indexable->object_id     = 1;
		$indexable->has_ancestors = true;

		$parent_indexable                = new Indexable_Mock();
		$parent_indexable->id            = 2;
		$parent_indexable->object_type   = 'term';
		$parent_indexable->object_id     = 2;
		$parent_indexable->has_ancestors = true;
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		Monkey\Functions\expect( 'get_the_terms' )
			->with( 1, 'tag' )
			->andReturn(
				[
					(object) [
						'term_id'  => 2,
						'taxonomy' => 'tag',
						'parent'   => 0,
					],
				]
			);
		Monkey\Functions\expect( 'get_term' )
			->with( 2 )
			->andReturn(
				(object) [
					'term_id'  => 2,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);
		Monkey\Functions\expect( 'get_post_meta' )->with( 1, WPSEO_Meta::$meta_prefix . 'primary_term', true )->andReturn( '' );

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 2, 1 );

		$this->primary_term_repository->expects( 'find_by_post_id_and_taxonomy' )->with( 1, 'tag', false )->andReturnFalse();

		$this->options->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( 'tag' );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 2, 'term' )->andReturn( $parent_indexable );

		$this->post->expects( 'get_post' )
			->with( 1 )
			->andReturn(
				(object) [
					'ID'          => 1,
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$actual = $this->instance->build( $indexable );
		$this->assertEquals( [ $parent_indexable ], $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with term parents, where the terms are not an array.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::get_indexable_id
	 * @covers ::get_primary_term_id
	 *
	 * @return void
	 */
	public function test_term_parent_where_terms_not_array() {
		$indexable                = new Indexable_Mock();
		$indexable->id            = 1;
		$indexable->object_type   = 'post';
		$indexable->object_id     = 1;
		$indexable->has_ancestors = true;

		Monkey\Functions\expect( 'get_the_terms' )->with( 1, 'tag' )->andReturn( 'string-not-array' );
		Monkey\Functions\expect( 'get_term' )
			->with( 2 )
			->andReturn(
				(object) [
					'term_id'  => 2,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);
		Monkey\Functions\expect( 'get_post_meta' )->with( 1, WPSEO_Meta::$meta_prefix . 'primary_term', true )->andReturn( '' );
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturnTrue();

		$this->primary_term_repository->expects( 'find_by_post_id_and_taxonomy' )->with( 1, 'tag', false )->andReturnFalse();

		$this->options->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( 'tag' );

		$this->post->expects( 'get_post' )
			->with( 1 )
			->andReturn(
				(object) [
					'ID'          => 1,
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 0, 0 );

		$actual = $this->instance->build( $indexable );
		$this->assertEmpty( $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with term parents, where the terms are empty.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::get_indexable_id
	 * @covers ::get_primary_term_id
	 *
	 * @return void
	 */
	public function test_term_parent_where_terms_empty() {
		$indexable                = new Indexable_Mock();
		$indexable->id            = 1;
		$indexable->object_type   = 'post';
		$indexable->object_id     = 1;
		$indexable->has_ancestors = true;
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		Monkey\Functions\expect( 'get_the_terms' )->with( 1, 'tag' )->andReturn();
		Monkey\Functions\expect( 'get_term' )
			->with( 2 )
			->andReturn(
				(object) [
					'term_id'  => 2,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);
		Monkey\Functions\expect( 'get_post_meta' )->with( 1, WPSEO_Meta::$meta_prefix . 'primary_term', true )->andReturn( '' );

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturnTrue();

		$this->primary_term_repository->expects( 'find_by_post_id_and_taxonomy' )->with( 1, 'tag', false )->andReturnFalse();

		$this->options->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( 'tag' );

		$this->post->expects( 'get_post' )
			->with( 1 )
			->andReturn(
				(object) [
					'ID'          => 1,
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 0, 0 );

		$actual = $this->instance->build( $indexable );
		$this->assertEmpty( $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with term parents.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::add_ancestors_for_term
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::find_deepest_term_id
	 * @covers ::get_term_parents
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 * @covers ::get_primary_term_id
	 *
	 * @return void
	 */
	public function test_deepest_term_parent() {
		$indexable                = new Indexable_Mock();
		$indexable->id            = 1;
		$indexable->object_type   = 'post';
		$indexable->object_id     = 1;
		$indexable->has_ancestors = true;

		$parent_indexable                = new Indexable_Mock();
		$parent_indexable->id            = 3;
		$parent_indexable->object_type   = 'term';
		$parent_indexable->object_id     = 3;
		$parent_indexable->has_ancestors = true;

		$grand_parent_indexable                = new Indexable_Mock();
		$grand_parent_indexable->id            = 4;
		$grand_parent_indexable->object_type   = 'term';
		$grand_parent_indexable->object_id     = 4;
		$grand_parent_indexable->has_ancestors = true;

		Monkey\Functions\expect( 'get_the_terms' )
			->once()
			->with( 1, 'tag' )
			->andReturn(
				[
					(object) [
						'term_id'  => 2,
						'taxonomy' => 'tag',
						'parent'   => 0,
					],
					(object) [
						'term_id'  => 3,
						'taxonomy' => 'tag',
						'parent'   => 4,
					],
				]
			);
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 3 )
			->andReturn(
				(object) [
					'term_id'  => 3,
					'taxonomy' => 'tag',
					'parent'   => 4,
				]
			);
		Monkey\Functions\expect( 'get_term' )
			->twice()
			->with( 4, 'tag' )
			->andReturn(
				(object) [
					'term_id'  => 4,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);
		Monkey\Functions\expect( 'get_post_meta' )->with( 1, WPSEO_Meta::$meta_prefix . 'primary_term', true )->andReturn( '' );
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 4, 2 );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 3, 1 );

		$this->primary_term_repository->expects( 'find_by_post_id_and_taxonomy' )->with( 1, 'tag', false )->andReturnFalse();

		$this->options->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( 'tag' );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 3, 'term' )->andReturn( $parent_indexable );
		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 4, 'term' )->andReturn( $grand_parent_indexable );

		$this->post->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'ID'          => 1,
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$actual = $this->instance->build( $indexable );
		$this->assertEquals( [ $grand_parent_indexable, $parent_indexable ], $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a term with term parents.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_term
	 * @covers ::get_term_parents
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_term() {
		$indexable                = new Indexable_Mock();
		$indexable->id            = 1;
		$indexable->object_type   = 'term';
		$indexable->object_id     = 1;
		$indexable->has_ancestors = true;

		$parent_indexable                = new Indexable_Mock();
		$parent_indexable->id            = 2;
		$parent_indexable->object_type   = 'term';
		$parent_indexable->object_id     = 2;
		$parent_indexable->has_ancestors = true;
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'term_id'  => 1,
					'taxonomy' => 'tag',
					'parent'   => 2,
				]
			);
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 2, 'tag' )
			->andReturn(
				(object) [
					'term_id'  => 2,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturnTrue();
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 2, 1 );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 2, 'term' )->andReturn( $parent_indexable );

		$actual = $this->instance->build( $indexable );
		$this->assertEquals( [ $parent_indexable ], $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a term with term parents which is unindexed.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_term
	 * @covers ::get_term_parents
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_term_with_ancestor_not_indexed() {
		$indexable                     = $this->get_indexable( 1, 'term' );
		$parent_indexable              = $this->get_indexable( 2, 'term' );
		$parent_indexable->post_status = 'unindexed';
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'term_id'  => 1,
					'taxonomy' => 'tag',
					'parent'   => 2,
				]
			);

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 2, 'tag' )
			->andReturn(
				(object) [
					'term_id'  => 2,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);

		$this->indexable_hierarchy_repository
			->expects( 'clear_ancestors' )
			->with( 1 )
			->andReturn( true );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( 2, 'term' )
			->andReturn( $parent_indexable );

		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 0, 0 );

		$actual = $this->instance->build( $indexable );
		$this->assertEmpty( $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a term with term parents which is the main object.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_term
	 * @covers ::get_term_parents
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_term_with_ancestor_is_the_main_object() {
		$indexable = $this->get_indexable( 1, 'term' );
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'term_id'  => 1,
					'taxonomy' => 'tag',
					'parent'   => 2,
				]
			);

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 2, 'tag' )
			->andReturn(
				(object) [
					'term_id'  => 2,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);

		$this->indexable_hierarchy_repository
			->expects( 'clear_ancestors' )
			->with( 1 )
			->andReturn( true );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( 2, 'term' )
			->andReturn( $indexable );

		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 0, 0 );

		$actual = $this->instance->build( $indexable );
		$this->assertEmpty( $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a term with term parents which is already added.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_term
	 * @covers ::get_term_parents
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 *
	 * @return void
	 */
	public function test_term_with_ancestor_is_already_added() {
		$indexable        = $this->get_indexable( 1, 'term' );
		$parent_indexable = $this->get_indexable( 2, 'term' );

		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'term_id'  => 1,
					'taxonomy' => 'tag',
					'parent'   => 2,
				]
			);

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 2, 'tag' )
			->andReturn(
				(object) [
					'term_id'  => 2,
					'taxonomy' => 'tag',
					'parent'   => 3,
				]
			);

		Monkey\Functions\expect( 'get_term' )
			->once()
			->with( 3, 'tag' )
			->andReturn(
				(object) [
					'term_id'  => 3,
					'taxonomy' => 'tag',
					'parent'   => 0,
				]
			);

		$this->indexable_hierarchy_repository
			->expects( 'clear_ancestors' )
			->with( 1 )
			->andReturn( true );

		$this->indexable_hierarchy_repository
			->expects( 'add_ancestor' )
			->with( 1, 2, 1 );

		$this->indexable_hierarchy_repository
			->expects( 'add_ancestor' )
			->with( 1, 2, 2 )
			->never();

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( 2, 'term' )
			->andReturn( $parent_indexable );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( 3, 'term' )
			->andReturn( $parent_indexable );

		$actual = $this->instance->build( $indexable );
		$this->assertEquals( [ $parent_indexable ], $actual->ancestors );
	}

	/**
	 * Tests building the hierarchy of a post with term parents when no primary term is set.
	 *
	 * @covers ::__construct
	 * @covers ::set_indexable_repository
	 * @covers ::build
	 * @covers ::save_ancestors
	 * @covers ::add_ancestors_for_post
	 * @covers ::add_ancestors_for_term
	 * @covers ::find_primary_term_id_for_post
	 * @covers ::find_deepest_term_id
	 * @covers ::get_term_parents
	 * @covers ::is_invalid_ancestor
	 * @covers ::get_indexable_id
	 * @covers ::get_primary_term_id
	 *
	 * @return void
	 */
	public function test_primary_term_parents_with_no_primary_term_set() {
		$indexable = $this->get_indexable( 1, 'post' );

		$parent_indexable                = new Indexable_Mock();
		$parent_indexable->id            = 3;
		$parent_indexable->object_type   = 'term';
		$parent_indexable->object_id     = 3;
		$parent_indexable->has_ancestors = true;
		$this->indexable_helper->expects( 'should_index_indexable' )->with( $indexable )->andReturnTrue();
		$this->indexable_hierarchy_repository
			->expects( 'clear_ancestors' )
			->with( 1 )
			->andReturnTrue();

		$this->post
			->expects( 'get_post' )
			->once()
			->with( 1 )
			->andReturn(
				(object) [
					'ID'          => 1,
					'post_parent' => 0,
					'post_type'   => 'post',
				]
			);

		$this->options
			->expects( 'get' )
			->with( 'post_types-post-maintax' )
			->andReturn( 'tag' );

		$this->primary_term_repository
			->expects( 'find_by_post_id_and_taxonomy' )
			->with( 1, 'tag', false )
			->andReturnFalse();

		Monkey\Functions\expect( 'get_the_terms' )
			->with( 1, 'tag' )
			->andReturn(
				[
					(object) [
						'term_id'    => 3,
						'taxonomy'   => 'tag',
						'parent'     => 4,
						'term_order' => 2,
					],
					(object) [
						'term_id'    => 2,
						'taxonomy'   => 'tag',
						'parent'     => 0,
						'term_order' => 1,
					],
				]
			);

		Monkey\Functions\expect( 'get_term' )
			->with( 4, 'tag' )
			->andReturn(
				(object) [
					'term_id'    => 4,
					'taxonomy'   => 'tag',
					'parent'     => 0,
					'term_order' => 1,
				]
			);
		Monkey\Functions\expect( 'get_post_meta' )->with( 1, WPSEO_Meta::$meta_prefix . 'primary_term', true )->andReturn( '' );

		$this->indexable_repository
			->expects( 'find_by_id_and_type' )
			->with( 3, 'term' )
			->andReturn( $parent_indexable );

		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 3, 1 );

		$actual = $this->instance->build( $indexable );
		$this->assertEquals( [ $parent_indexable ], $actual->ancestors );
	}

	/**
	 * Retrieves a parent indexable.
	 *
	 * @param string $id          The id to use.
	 * @param string $object_type The object type.
	 *
	 * @return Indexable_Mock
	 */
	private function get_indexable( $id, $object_type = 'post' ) {
		$indexable                = new Indexable_Mock();
		$indexable->id            = $id;
		$indexable->object_type   = $object_type;
		$indexable->object_id     = $id;
		$indexable->has_ancestors = true;

		return $indexable;
	}
}

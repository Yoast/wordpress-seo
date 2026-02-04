<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces;

use Brain\Monkey\Functions;
use Mockery;
use WP_Post;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Test class for the reset_global_state method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\WordPress_Global_State_Adapter::reset_global_state
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class WordPress_Global_State_Adapter_Reset_Global_State_Test extends Abstract_WordPress_Global_State_Adapter_Test {

	/**
	 * Tests that reset_global_state restores the previous post.
	 *
	 * @return void
	 */
	public function test_reset_global_state_restores_previous_post() {
		global $post, $wp_query;

		$initial_post     = Mockery::mock( WP_Post::class );
		$initial_post->ID = 456;
		$post             = $initial_post;
		$wp_query         = (object) [
			'queried_object'    => $initial_post,
			'queried_object_id' => 456,
			'is_single'         => false,
			'is_singular'       => false,
			'is_page'           => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post            = Mockery::mock( WP_Post::class )->makePartial();
		$new_post->ID        = 123;
		$new_post->post_type = 'post';

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		$this->assertSame( $new_post, $post );

		Functions\expect( 'wp_reset_postdata' )
			->once();

		$this->instance->reset_global_state();

		$this->assertSame( $initial_post, $post );
	}

	/**
	 * Tests that reset_global_state restores the previous queried_object.
	 *
	 * @return void
	 */
	public function test_reset_global_state_restores_previous_queried_object() {
		global $post, $wp_query;

		$initial_queried_object     = Mockery::mock( WP_Post::class );
		$initial_queried_object->ID = 789;

		$post     = null;
		$wp_query = (object) [
			'queried_object'    => $initial_queried_object,
			'queried_object_id' => 789,
			'is_single'         => false,
			'is_singular'       => false,
			'is_page'           => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post            = Mockery::mock( WP_Post::class )->makePartial();
		$new_post->ID        = 123;
		$new_post->post_type = 'post';

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		$this->assertSame( $new_post, $wp_query->queried_object );

		Functions\expect( 'wp_reset_postdata' )
			->once();

		$this->instance->reset_global_state();

		$this->assertSame( $initial_queried_object, $wp_query->queried_object );
	}

	/**
	 * Tests that reset_global_state restores the previous queried_object_id.
	 *
	 * @return void
	 */
	public function test_reset_global_state_restores_previous_queried_object_id() {
		global $post, $wp_query;

		$post     = null;
		$wp_query = (object) [
			'queried_object'    => null,
			'queried_object_id' => 789,
			'is_single'         => false,
			'is_singular'       => false,
			'is_page'           => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post            = Mockery::mock( WP_Post::class )->makePartial();
		$new_post->ID        = 123;
		$new_post->post_type = 'post';

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		$this->assertSame( 123, $wp_query->queried_object_id );

		Functions\expect( 'wp_reset_postdata' )
			->once();

		$this->instance->reset_global_state();

		$this->assertSame( 789, $wp_query->queried_object_id );
	}

	/**
	 * Tests that reset_global_state properly restores previous query flags.
	 *
	 * @return void
	 */
	public function test_reset_global_state_restores_previous_query_flags() {
		global $post, $wp_query;

		$post     = null;
		$wp_query = (object) [
			'queried_object'    => null,
			'queried_object_id' => null,
			'is_single'         => false,
			'is_singular'       => false,
			'is_page'           => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post            = Mockery::mock( WP_Post::class );
		$new_post->ID        = 123;
		$new_post->post_type = 'post';

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		// After setting global state for post
		$this->assertTrue( $wp_query->is_single );
		$this->assertTrue( $wp_query->is_singular );
		$this->assertFalse( $wp_query->is_page );

		Functions\expect( 'wp_reset_postdata' )
			->once();

		$this->instance->reset_global_state();

		// Should be restored to original values
		$this->assertFalse( $wp_query->is_single );
		$this->assertFalse( $wp_query->is_singular );
		$this->assertFalse( $wp_query->is_page );
	}

	/**
	 * Tests that reset_global_state properly restores previous query flags for pages.
	 *
	 * @return void
	 */
	public function test_reset_global_state_restores_previous_query_flags_for_pages() {
		global $post, $wp_query;

		$post     = null;
		$wp_query = (object) [
			'queried_object'    => null,
			'queried_object_id' => null,
			'is_single'         => true,
			'is_singular'       => false,
			'is_page'           => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_page            = Mockery::mock( WP_Post::class )->makePartial();
		$new_page->ID        = 123;
		$new_page->post_type = 'page';

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_page );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_page );

		$this->instance->set_global_state( $indexable );

		// After setting global state for page
		$this->assertFalse( $wp_query->is_single );
		$this->assertTrue( $wp_query->is_singular );
		$this->assertTrue( $wp_query->is_page );

		Functions\expect( 'wp_reset_postdata' )
			->once();

		$this->instance->reset_global_state();

		// Should be restored to original values
		$this->assertTrue( $wp_query->is_single );
		$this->assertFalse( $wp_query->is_singular );
		$this->assertFalse( $wp_query->is_page );
	}

	/**
	 * Tests reset_global_state with null previous values.
	 *
	 * @return void
	 */
	public function test_reset_global_state_with_null_previous_values() {
		global $post, $wp_query;

		$post     = null;
		$wp_query = (object) [
			'queried_object'    => null,
			'queried_object_id' => null,
			'is_single'         => false,
			'is_singular'       => false,
			'is_page'           => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post            = Mockery::mock( WP_Post::class )->makePartial();
		$new_post->ID        = 123;
		$new_post->post_type = 'post';

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		$this->assertSame( $new_post, $post );
		$this->assertSame( $new_post, $wp_query->queried_object );
		$this->assertSame( 123, $wp_query->queried_object_id );

		Functions\expect( 'wp_reset_postdata' )
			->once();

		$this->instance->reset_global_state();

		$this->assertNull( $post );
		$this->assertNull( $wp_query->queried_object );
		$this->assertNull( $wp_query->queried_object_id );
	}

	/**
	 * Tests reset_global_state with missing wp_query.
	 *
	 * @return void
	 */
	public function test_reset_global_state_with_missing_wp_query() {
		global $post, $wp_query;

		$initial_post     = Mockery::mock( WP_Post::class );
		$initial_post->ID = 456;
		$post             = $initial_post;

		$wp_query = (object) [];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post            = Mockery::mock( WP_Post::class )->makePartial();
		$new_post->ID        = 123;
		$new_post->post_type = 'post';

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		$wp_query = null;

		Functions\expect( 'wp_reset_postdata' )
			->once();

		$this->instance->reset_global_state();

		$this->assertSame( $initial_post, $post );
	}

	/**
	 * Tests that reset_global_state calls wp_reset_postdata.
	 *
	 * @return void
	 */
	public function test_reset_global_state_calls_wp_reset_postdata() {
		global $post, $wp_query;

		$post     = null;
		$wp_query = (object) [
			'queried_object'    => null,
			'queried_object_id' => null,
			'is_single'         => false,
			'is_singular'       => false,
			'is_page'           => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post            = Mockery::mock( WP_Post::class )->makePartial();
		$new_post->ID        = 123;
		$new_post->post_type = 'post';

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		Functions\expect( 'wp_reset_postdata' )
			->once();

		$this->instance->reset_global_state();
	}
}

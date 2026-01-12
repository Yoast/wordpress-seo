<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Infrastructure\Schema_Pieces;

use Brain\Monkey\Functions;
use Mockery;
use stdClass;
use WP_Post;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Test class for the set_global_state method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces\WordPress_Global_State_Adapter::set_global_state
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class WordPress_Global_State_Adapter_Set_Global_State_Test extends Abstract_WordPress_Global_State_Adapter_Test {

	/**
	 * Tests setting global state with a valid indexable.
	 *
	 * @return void
	 */
	public function test_set_global_state_with_valid_indexable() {
		global $post, $wp_query;

		$initial_post     = Mockery::mock( WP_Post::class );
		$initial_post->ID = 999;
		$post             = $initial_post;
		$wp_query         = (object) [
			'queried_object'    => $initial_post,
			'queried_object_id' => 999,
			'is_single'         => false,
			'is_singular'       => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$mock_post     = Mockery::mock( WP_Post::class );
		$mock_post->ID = 123;

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $mock_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $mock_post );

		$this->instance->set_global_state( $indexable );

		$this->assertSame( $mock_post, $post );
		$this->assertSame( $mock_post, $wp_query->queried_object );
		$this->assertSame( 123, $wp_query->queried_object_id );
		$this->assertTrue( $wp_query->is_single );
		$this->assertTrue( $wp_query->is_singular );
		$this->assertSame( $initial_post, $this->getPropertyValue( $this->instance, 'previous_post' ) );
		$this->assertSame( $initial_post, $this->getPropertyValue( $this->instance, 'previous_queried_object' ) );
		$this->assertSame( 999, $this->getPropertyValue( $this->instance, 'previous_queried_object_id' ) );
	}

	/**
	 * Tests that set_global_state stores the previous post.
	 *
	 * @return void
	 */
	public function test_set_global_state_stores_previous_post() {
		global $post, $wp_query;

		$previous_post     = Mockery::mock( WP_Post::class );
		$previous_post->ID = 456;
		$post              = $previous_post;

		$wp_query = (object) [
			'queried_object'    => null,
			'queried_object_id' => null,
			'is_single'         => false,
			'is_singular'       => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post     = Mockery::mock( WP_Post::class );
		$new_post->ID = 123;

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		$this->assertSame( $previous_post, $this->getPropertyValue( $this->instance, 'previous_post' ) );
	}

	/**
	 * Tests that set_global_state stores the previous queried_object.
	 *
	 * @return void
	 */
	public function test_set_global_state_stores_previous_queried_object() {
		global $post, $wp_query;

		$previous_queried_object     = Mockery::mock( WP_Post::class );
		$previous_queried_object->ID = 789;

		$post     = null;
		$wp_query = (object) [
			'queried_object'    => $previous_queried_object,
			'queried_object_id' => 789,
			'is_single'         => false,
			'is_singular'       => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post     = Mockery::mock( WP_Post::class );
		$new_post->ID = 123;

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		$this->assertSame( $previous_queried_object, $this->getPropertyValue( $this->instance, 'previous_queried_object' ) );
	}

	/**
	 * Tests that set_global_state stores the previous queried_object_id.
	 *
	 * @return void
	 */
	public function test_set_global_state_stores_previous_queried_object_id() {
		global $post, $wp_query;

		$post     = null;
		$wp_query = (object) [
			'queried_object'    => null,
			'queried_object_id' => 456,
			'is_single'         => false,
			'is_singular'       => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post     = Mockery::mock( WP_Post::class );
		$new_post->ID = 123;

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		$this->assertSame( 456, $this->getPropertyValue( $this->instance, 'previous_queried_object_id' ) );
	}

	/**
	 * Tests set_global_state with null previous values.
	 *
	 * @return void
	 */
	public function test_set_global_state_with_null_previous_values() {
		global $post, $wp_query;

		$post     = null;
		$wp_query = (object) [
			'queried_object'    => null,
			'queried_object_id' => null,
			'is_single'         => false,
			'is_singular'       => false,
		];

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post     = Mockery::mock( WP_Post::class );
		$new_post->ID = 123;

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		$this->assertNull( $this->getPropertyValue( $this->instance, 'previous_post' ) );
		$this->assertNull( $this->getPropertyValue( $this->instance, 'previous_queried_object' ) );
		$this->assertNull( $this->getPropertyValue( $this->instance, 'previous_queried_object_id' ) );
	}

	/**
	 * Tests set_global_state with missing wp_query properties.
	 *
	 * @return void
	 */
	public function test_set_global_state_with_missing_wp_query_properties() {
		global $post, $wp_query;

		$post = null;

		$wp_query = new stdClass();

		$indexable            = new Indexable_Mock();
		$indexable->object_id = 123;

		$new_post     = Mockery::mock( WP_Post::class );
		$new_post->ID = 123;

		Functions\expect( 'get_post' )
			->twice()
			->with( 123 )
			->andReturn( $new_post );

		Functions\expect( 'setup_postdata' )
			->once()
			->with( $new_post );

		$this->instance->set_global_state( $indexable );

		$this->assertNull( $this->getPropertyValue( $this->instance, 'previous_post' ) );
		$this->assertNull( $this->getPropertyValue( $this->instance, 'previous_queried_object' ) );
		$this->assertNull( $this->getPropertyValue( $this->instance, 'previous_queried_object_id' ) );
	}
}
